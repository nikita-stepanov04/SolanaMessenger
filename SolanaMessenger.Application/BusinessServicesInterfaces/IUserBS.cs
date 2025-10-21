using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface IUserBS
    {
        Task<UserDTO?> GetByLoginAsync(string login);
        Task<OperationResult<Guid>> RegisterUserAsync(UserRegistrationDTO userDTO);
        Task<bool> IsLoginNotTakenAsync(string login);
        Task<UserDTO?> CheckCredentialsForLoginAsync(UserLogInDTO userDTO);
    }
}
