using System.Diagnostics.CodeAnalysis;

namespace SolanaMessenger.Application
{
    public record struct OpRes<TResult>
    {
        public TResult? Result { get; set; }        
        public string? ErrorMessage { get; set; }

        [MemberNotNullWhen(false, nameof(Result))]
        [MemberNotNullWhen(true, nameof(ErrorMessage))]
        public bool HasError => !string.IsNullOrEmpty(ErrorMessage);        
    }

    public static class OpRes
    {
        public static OpRes<TResult> Err<TResult>(string message) => new OpRes<TResult>
        {
            Result = default,
            ErrorMessage = message
        };

        public static OpRes<TResult> Err<TResult>() => new OpRes<TResult>
        {
            Result = default,
            ErrorMessage = "Something went wrong"
        };

        public static OpRes<TResult> Success<TResult>(TResult result) => new OpRes<TResult>
        {
            Result = result
        };
    }
}
