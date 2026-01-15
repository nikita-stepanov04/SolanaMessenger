using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Application.DTOs.Users;

namespace SolanaMessenger.Application
{
    public interface IUserBS
    {
        Task<UserDTO?> GetByLoginAsync(string login);
        Task<OpRes<Guid>> RegisterUserAsync(UserRegistrationDTO userDTO);
        Task<bool> IsLoginNotTakenAsync(string login);
        Task<UserDTO?> CheckCredentialsForLoginAsync(UserLogInDTO userDTO);
        Task<List<UserMinDTO>> GetByLoginSubstring(string loginSubstring);
    }
}
