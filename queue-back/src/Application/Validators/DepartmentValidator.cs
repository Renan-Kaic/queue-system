using cronly_back.Application.DTOs;
using cronly_back.Domain.Entities;
using cronly_back.Domain.Enums;
using FluentValidation;

namespace cronly_back.Application.Validators;

public class CreateDepartmentValidator : AbstractValidator<CreateDepartmentRequest>
{
    public CreateDepartmentValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome do departamento é obrigatório")
            .MaximumLength(255)
            .WithMessage("O nome deve ter no máximo 255 caracteres")
            .MinimumLength(3)
            .WithMessage("O nome deve ter no mínimo 3 caracteres");

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("O código do departamento é obrigatório")
            .MaximumLength(10)
            .WithMessage("O código deve ter no máximo 10 caracteres")
            .MinimumLength(2)
            .WithMessage("O código deve ter no mínimo 2 caracteres")
            .Matches("^[A-Z0-9-]+$")
            .WithMessage("O código deve conter apenas letras maiúsculas, números e hífens");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("A descrição deve ter no máximo 500 caracteres")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .WithMessage("A capacidade deve ser maior que zero")
            .LessThanOrEqualTo(1000)
            .WithMessage("A capacidade deve ser no máximo 1000");

        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Status inválido");
    }
}

public class UpdateDepartmentValidator : AbstractValidator<UpdateDepartmentRequest>
{
    public UpdateDepartmentValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Para atualizar o departamento, o ID deve ser informado.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome do departamento é obrigatório")
            .MaximumLength(255)
            .WithMessage("O nome deve ter no máximo 255 caracteres")
            .MinimumLength(3)
            .WithMessage("O nome deve ter no mínimo 3 caracteres");

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("O código do departamento é obrigatório")
            .MaximumLength(10)
            .WithMessage("O código deve ter no máximo 10 caracteres")
            .MinimumLength(2)
            .WithMessage("O código deve ter no mínimo 2 caracteres")
            .Matches("^[A-Z0-9-]+$")
            .WithMessage("O código deve conter apenas letras maiúsculas, números e hífens");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("A descrição deve ter no máximo 500 caracteres")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .WithMessage("A capacidade deve ser maior que zero")
            .LessThanOrEqualTo(1000)
            .WithMessage("A capacidade deve ser no máximo 1000");

        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Status inválido");
    }
}

