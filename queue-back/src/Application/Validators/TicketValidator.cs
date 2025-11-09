using cronly_back.Application.DTOs;
using FluentValidation;

namespace cronly_back.Application.Validators;

public class CreateTicketValidator : AbstractValidator<CreateTicketRequest>
{
    public CreateTicketValidator()
    {
        RuleFor(x => x.QueueId)
            .GreaterThan(0)
            .WithMessage("O ID da fila deve ser maior que zero.");

        RuleFor(x => x.CitizenId)
            .GreaterThan(0)
            .WithMessage("O ID do cidadão deve ser maior que zero.");

        RuleFor(x => x.Priority)
            .IsInEnum()
            .WithMessage("A prioridade informada é inválida.");
    }
}

public class UpdateTicketValidator : AbstractValidator<UpdateTicketRequest>
{
    public UpdateTicketValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("O ID do ticket deve ser maior que zero.");

        RuleFor(x => x.TicketNumber)
            .NotEmpty()
            .WithMessage("O código do ticket é obrigatório.")
            .MaximumLength(50)
            .WithMessage("O código do ticket deve ter no máximo 50 caracteres.");

        RuleFor(x => x.TicketStatus)
            .IsInEnum()
            .WithMessage("O status informado é inválido.");

        RuleFor(x => x.Priority)
            .IsInEnum()
            .WithMessage("A prioridade informada é inválida.");
    }
}
