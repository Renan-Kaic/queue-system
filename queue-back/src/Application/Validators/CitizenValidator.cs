using cronly_back.Application.DTOs;
using cronly_back.Domain.Enums;
using FluentValidation;

namespace cronly_back.Application.Validators;

public abstract class CreateCitizenRequestValidator : AbstractValidator<CreateCitizenRequest>
{
    protected CreateCitizenRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome completo é obrigatório.")
            .MinimumLength(3)
            .WithMessage("O nome deve ter no mínimo 3 caracteres.")
            .MaximumLength(255)
            .WithMessage("O nome deve ter no máximo 255 caracteres.")
            .Matches(@"^[a-zA-ZÀ-ÿ\s'-]+$")
            .WithMessage("O nome deve conter apenas letras, espaços, hífens e apóstrofos.");

        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage("O email informado não é válido.")
            .MaximumLength(255)
            .WithMessage("O email deve ter no máximo 255 caracteres.");
        
        RuleFor(x => x.Document)
            .Matches(@"^\d{11}$|^\d{14}$")
            .When(x => !string.IsNullOrEmpty(x.Document))
            .WithMessage("O documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
        
        RuleFor(x => x.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .When(x => !string.IsNullOrEmpty(x.Phone))
            .WithMessage("O telefone deve estar em um formato válido (ex: +5511999999999).");
        
        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("O tipo de cidadão informado é inválido. Valores aceitos: 0 (Normal), 1 (Priority), 2 (Vip).");
    }

    private static bool BeValidCpf(string? cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return false;

        cpf = cpf.Replace(".", "").Replace("-", "").Replace(" ", "");

        if (cpf.Length != 11)
            return false;

        if (cpf.Distinct().Count() == 1)
            return false;

        int[] multiplicador1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
        int[] multiplicador2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

        var tempCpf = cpf[..9];
        var soma = 0;

        for (var i = 0; i < 9; i++)
            soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];

        var resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;

        var digito = resto.ToString();
        tempCpf += digito;
        soma = 0;

        for (var i = 0; i < 10; i++)
            soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];

        resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;
        digito += resto.ToString();

        return cpf.EndsWith(digito);
    }
}

public abstract class UpdateCitizenRequestValidator : AbstractValidator<UpdateCitizenRequest>
{
    protected UpdateCitizenRequestValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("O ID do usuario e obrigatorio");
        
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("O nome completo é obrigatório.")
            .MinimumLength(3)
            .WithMessage("O nome deve ter no mínimo 3 caracteres.")
            .MaximumLength(255)
            .WithMessage("O nome deve ter no máximo 255 caracteres.")
            .Matches(@"^[a-zA-ZÀ-ÿ\s'-]+$")
            .WithMessage("O nome deve conter apenas letras, espaços, hífens e apóstrofos.");

        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage("O email informado não é válido.")
            .MaximumLength(255)
            .WithMessage("O email deve ter no máximo 255 caracteres.");
        
        RuleFor(x => x.Document)
            .Matches(@"^\d{11}$|^\d{14}$")
            .When(x => !string.IsNullOrEmpty(x.Document))
            .WithMessage("O documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
        
        RuleFor(x => x.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .When(x => !string.IsNullOrEmpty(x.Phone))
            .WithMessage("O telefone deve estar em um formato válido (ex: +5511999999999).");
        
        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("O tipo de cidadão informado é inválido. Valores aceitos: 0 (Normal), 1 (Priority), 2 (Vip).");
    }

    private static bool BeValidCpf(string? cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf))
            return false;

        cpf = cpf.Replace(".", "").Replace("-", "").Replace(" ", "");

        if (cpf.Length != 11)
            return false;

        if (cpf.Distinct().Count() == 1)
            return false;

        int[] multiplicador1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
        int[] multiplicador2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

        var tempCpf = cpf[..9];
        var soma = 0;

        for (var i = 0; i < 9; i++)
            soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];

        var resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;

        var digito = resto.ToString();
        tempCpf += digito;
        soma = 0;

        for (var i = 0; i < 10; i++)
            soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];

        resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;
        digito += resto.ToString();

        return cpf.EndsWith(digito);
    }
}
