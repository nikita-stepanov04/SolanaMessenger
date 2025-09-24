using AutoMapper;
using SolanaMessenger.Application.Cryptography;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Domain.Entities;
using SolanaMessenger.Infrastructure;

namespace SolanaMessenger.Application.BusinessServices
{
    public class UserBS : IUserBS
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRep;

        public UserBS(IMapper mapper, IUserRepository userRep)
        {
            _mapper = mapper;
            _userRep = userRep;
        }

        public async Task<UserDTO?> GetByIDAsync(long id)
        {
            var user = await _userRep.GetByIDAsync(id);
            return _mapper.Map<UserDTO?>(user);
        }

        public async Task<long> RegisterUserAsync(UserDTO userDTO)
        {
            var user = _mapper.Map<User>(userDTO);

            if (!await IsLoginNotTakenAsync(user.Login)) 
                return 0;

            user.PasswordHash = Hashing.Sha256(userDTO.Password);

            await _userRep.AddAsync(user);
            await _userRep.SaveChangesAsync();

            return user.ID;
        }

        public async Task<bool> IsLoginNotTakenAsync(string login)
        {
            return (await _userRep.GetByLoginAsync(login)) == null;
        }

        public async Task<UserDTO?> GetByLoginAsync(string login)
        {
            var user = await _userRep.GetByLoginAsync(login);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO?> CheckCredentialsForLoginAsync(UserLoginDTO userDTO)
        {
            var user = await _userRep.GetByLoginAsync(userDTO.Login);

            var requestPasswordHash = Hashing.Sha256(userDTO.Password);

            if (user == null || !user.PasswordHash.SequenceEqual(requestPasswordHash))
                return null;

            return _mapper.Map<UserDTO>(user);
        }
    }
}
