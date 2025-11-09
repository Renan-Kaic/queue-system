namespace cronly_back.shared;

public static class Utils
{
    public static string? SanitizeInput(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return input;

        var sanitized = input
            .Replace("<", "&lt;")
            .Replace(">", "&gt;")
            .Replace("\"", "&quot;")
            .Replace("'", "&#x27;")
            .Replace("/", "&#x2F;")
            .Trim();

        return sanitized;
    }
}