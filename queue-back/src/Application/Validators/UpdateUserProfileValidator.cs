using System.Data;
using cronly_back.Application.Commands;
using FluentValidation;

namespace cronly_back.Application.Validators;

public class UpdateUserProfileValidator : AbstractValidator<UpdateUserProfileCommand>
{
    public UpdateUserProfileValidator()
    {
        RuleFor(x => x.UserId)
             .NotEmpty()
             .WithMessage("O ID do usuário é obrigatório.");

        RuleFor(x => x.FullName)
            .NotEmpty()
            .WithMessage("O nome completo é obrigatório.")
            .MinimumLength(3)
            .WithMessage("O nome deve ter no mínimo 3 caracteres.")
            .MaximumLength(255)
            .WithMessage("O nome deve ter no máximo 255 caracteres.")
            .Matches(@"^[a-zA-ZÀ-ÿ\s'-]+$")
            .WithMessage("O nome deve conter apenas letras, espaços, hífens e apóstrofos.");

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber))
            .WithMessage("O telefone deve estar em um formato válido (ex: +5511999999999).");

        RuleFor(x => x.ProfilePictureUrl)
            .Must(BeAValidUrl)
            .When(x => !string.IsNullOrEmpty(x.ProfilePictureUrl))
            .WithMessage("A URL da foto de perfil deve ser válida.");
    }
    
    private static bool BeAValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}