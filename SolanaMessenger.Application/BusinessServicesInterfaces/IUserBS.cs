using SolanaMessenger.Application.DTOs;

namespace SolanaMessenger.Application
{
    public interface IUserBS
    {
        Task<UserDTO?> GetByIDAsync(long id);
        Task<long> RegisterUserAsync(UserDTO userDTO);
        Task<bool> IsLoginNotTakenAsync(string login);
        Task<UserDTO?> GetByLoginAsync(string login);
        Task<UserDTO?> CheckCredentialsForLoginAsync(UserLoginDTO userDTO);
    }
}
