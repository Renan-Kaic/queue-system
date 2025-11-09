using cronly_back.Application.DTOs;
using FluentValidation;

namespace cronly_back.Application.Validators;

public class CreateQueueValidator : AbstractValidator<CreateQueueRequest>
{
    public CreateQueueValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome é obrigatório.")
            .MaximumLength(255)
            .WithMessage("O nome deve ter no máximo 255 caracteres.")
            .Matches(@"^[a-zA-ZÀ-ÿ0-9\s\-_]+$")
            .WithMessage("O nome contém caracteres inválidos.");

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("O código é obrigatório.")
            .MaximumLength(50)
            .WithMessage("O código deve ter no máximo 50 caracteres.")
            .Matches(@"^[A-Z0-9\-_]+$")
            .WithMessage("O código deve conter apenas letras maiúsculas, números, hífens e underscores.");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("A descrição deve ter no máximo 500 caracteres.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.MaxQueueSize)
            .GreaterThan(0)
            .WithMessage("O tamanho máximo da fila deve ser maior que zero.")
            .LessThanOrEqualTo(1000)
            .WithMessage("O tamanho máximo da fila não pode exceder 1000.");

        RuleFor(x => x.DepartmentId)
            .GreaterThan(0)
            .WithMessage("O ID do departamento deve ser maior que zero.");

        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Status inválido.");
    }
}

public class UpdateQueueValidator : AbstractValidator<UpdateQueueRequest>
{
    public UpdateQueueValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("O ID da fila deve ser maior que zero.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome é obrigatório.")
            .MaximumLength(255)
            .WithMessage("O nome deve ter no máximo 255 caracteres.")
            .Matches(@"^[a-zA-ZÀ-ÿ0-9\s\-_]+$")
            .WithMessage("O nome contém caracteres inválidos.");

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("O código é obrigatório.")
            .MaximumLength(50)
            .WithMessage("O código deve ter no máximo 50 caracteres.")
            .Matches(@"^[A-Z0-9\-_]+$")
            .WithMessage("O código deve conter apenas letras maiúsculas, números, hífens e underscores.");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("A descrição deve ter no máximo 500 caracteres.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.MaxQueueSize)
            .GreaterThan(0)
            .WithMessage("O tamanho máximo da fila deve ser maior que zero.")
            .LessThanOrEqualTo(1000)
            .WithMessage("O tamanho máximo da fila não pode exceder 1000.");

        RuleFor(x => x.DepartmentId)
            .GreaterThan(0)
            .WithMessage("O ID do departamento deve ser maior que zero.");

        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Status inválido.");
    }
}