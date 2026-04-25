package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/alpemreelmas/spa-contact/app/contact"
	"github.com/alpemreelmas/spa-contact/app/healthcheck"
	"github.com/alpemreelmas/spa-contact/db"
	"github.com/alpemreelmas/spa-contact/pkg/config"
	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"go.uber.org/zap"
	_ "modernc.org/sqlite"
)

// RequestDurationMiddleware measures the duration of HTTP requests
func RequestDurationMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		start := time.Now()

		// Call next handler
		err := c.Next()

		// Record duration after the handler returns
		duration := time.Since(start).Seconds()
		status := strconv.Itoa(c.Response().StatusCode())

		zap.L().Info("Request completed", zap.String("method", c.Method()), zap.String("route", c.Path()), zap.String("status", status), zap.Float64("duration_seconds", duration))

		return err
	}
}

type structValidator struct {
	validate *validator.Validate
}

// Validator needs to implement the Validate method
func (v *structValidator) Validate(out any) error {
	return v.validate.Struct(out)
}

type Request any
type Response any

// Define an interface for handlers
type HandlerInterface[R Request, Res Response] interface {
	Handle(ctx context.Context, req *R) (*Res, error)
}

// Update handle function to accept HandlerInterface instead of Handler function
func handle[R Request, Res Response](handler HandlerInterface[R, Res]) fiber.Handler {
	return func(c fiber.Ctx) error {
		var req R

		if c.Method() == fiber.MethodPost || c.Method() == fiber.MethodPut || c.Method() == fiber.MethodPatch {
			if err := c.Bind().Body(&req); err != nil && !errors.Is(err, fiber.ErrUnprocessableEntity) {
				if validationErrors, ok := err.(validator.ValidationErrors); ok {
					for _, e := range validationErrors {
						return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
							"field": e.Field(),
							"error": fmt.Sprintf("validation failed on '%s'", e.Tag()),
						})
					}
				}
				return err
			}
		}

		if err := c.Bind().URI(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if err := c.Bind().Query(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if err := c.Bind().Header(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		/* ctx, cancel := context.WithTimeout(c.UserContext(), 3*time.Second)
		defer cancel()
		*/

		ctx := c.Context()

		res, err := handler.Handle(ctx, &req)
		if err != nil {
			zap.L().Error("Failed to handle request", zap.Error(err))
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"data":    res,
		})
	}
}

func main() {
	appConfig := config.Read()
	defer zap.L().Sync()
	zap.L().Info("app starting...")
	zap.L().Info("app config", zap.Any("appConfig", appConfig))

	database := db.Init(appConfig.DsnUri)

	healthcheckHandler := healthcheck.NewHealthCheckHandler()
	contactListHandler := contact.NewListContactHandler(database)
	contactHandler := contact.NewCreateContactHandler(database)
	contactUpdateHandler := contact.NewUpdateContactHandler(database)
	contactDeleteHandler := contact.NewDeleteContactHandler(database)

	app := fiber.New(fiber.Config{
		IdleTimeout:  5 * time.Second,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Concurrency:  256 * 1024,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))

	app.Use(RequestDurationMiddleware())
	api := app.Group("/api/v1")
	api.Get("/healthcheck", handle[healthcheck.HealthCheckRequest, healthcheck.HealthCheckResponse](healthcheckHandler))
	api.Get("/contacts", handle[contact.ListContactRequest, contact.ListContactResponse](contactListHandler))
	api.Post("/contacts", handle[contact.CreateContactRequest, contact.CreateContactResponse](contactHandler))
	api.Put("/contacts/:id", handle[contact.UpdateContactRequest, contact.UpdateContactResponse](contactUpdateHandler))
	api.Delete("/contacts/:id", handle[contact.DeleteContactRequest, contact.DeleteContactResponse](contactDeleteHandler))

	// Start server in a goroutine
	go func() {
		if err := app.Listen(fmt.Sprintf("0.0.0.0:%s", appConfig.Port)); err != nil {
			zap.L().Error("Failed to start server", zap.Error(err))
			os.Exit(1)
		}
	}()

	zap.L().Info("Server started on port", zap.String("port", appConfig.Port))

	gracefulShutdown(app)
}

func gracefulShutdown(app *fiber.App) {
	// Create channel for shutdown signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// Wait for shutdown signal
	<-sigChan
	zap.L().Info("Shutting down server...")

	// Shutdown with 5 second timeout
	if err := app.ShutdownWithTimeout(5 * time.Second); err != nil {
		zap.L().Error("Error during server shutdown", zap.Error(err))
	}

	zap.L().Info("Server gracefully stopped")
}
