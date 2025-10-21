using System.Diagnostics.CodeAnalysis;

namespace SolanaMessenger.Application
{
    public class OperationResult<TResult>
    {
        public TResult? Result { get; set; }        
        public string? ErrorMessage { get; set; }

        [MemberNotNullWhen(false, nameof(Result))]
        [MemberNotNullWhen(true, nameof(ErrorMessage))]
        public bool HasError => !string.IsNullOrEmpty(ErrorMessage);        
    }

    public static class OperationResult
    {
        public static OperationResult<TResult> Error<TResult>(string message) => new OperationResult<TResult>
        {
            Result = default,
            ErrorMessage = message
        };

        public static OperationResult<TResult> Error<TResult>() => new OperationResult<TResult>
        {
            Result = default,
            ErrorMessage = "Something went wrong"
        };

        public static OperationResult<TResult> Success<TResult>(TResult result) => new OperationResult<TResult>
        {
            Result = result
        };
    }
}
