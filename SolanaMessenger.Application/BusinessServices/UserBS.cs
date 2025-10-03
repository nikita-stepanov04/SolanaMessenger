using AutoMapper;
using SolanaMessenger.Application.Cryptography;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Domain.Entities;
using SolanaMessenger.Infrastructure;
using SolanaMessenger.Infrastructure.Blockchain;

namespace SolanaMessenger.Application.BusinessServices
{
    public class UserBS : IUserBS
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRep;
        private readonly IBlockchainRepository<UserData> _blockchainRep;

        public UserBS(
            IMapper mapper,
            IUserRepository userRep,
            IBlockchainRepository<UserData> blockchainRep)
        {
            _mapper = mapper;
            _userRep = userRep;
            _blockchainRep = blockchainRep;
        }

        public async Task<UserDTO?> GetByLoginAsync(string login)
        {
            var user = await _userRep.GetByLoginAsync(login);

            var userData = user != null 
                ? await _blockchainRep.GetObjectAsync(user.Signatures)
                : null;

            return _mapper.Map<UserDTO?>(userData);
        }

        public async Task<Guid> RegisterUserAsync(UserRegistrationDTO userDTO)
        {
            var userData = _mapper.Map<UserData>(userDTO);

            if (!await IsLoginNotTakenAsync(userData.Login)) 
                return Guid.Empty;

            var id = Guid.NewGuid();

            userData.ID = id;
            userData.PasswordHash = Hashing.Sha256(userDTO.Password);
           
            var signatures = await _blockchainRep.WriteObjectAsync(userData);
            if (signatures == null)
                return Guid.Empty;

            var user = new User
            {
                ID = id,
                Login = userData.Login,
                Signatures = signatures
            };

            await _userRep.AddAsync(user);
            await _userRep.SaveChangesAsync();
            return userData.ID;           
        }

        public async Task<bool> IsLoginNotTakenAsync(string login)
        {
            return (await _userRep.GetByLoginAsync(login)) == null;
        }

        public async Task<UserDTO?> CheckCredentialsForLoginAsync(UserLogInDTO userDTO)
        {
            var user = await _userRep.GetByLoginAsync(userDTO.Login);

            var userData = user != null
                ? await _blockchainRep.GetObjectAsync(user.Signatures)
                : null;

            if (userData == null || !userData.PasswordHash.SequenceEqual(Hashing.Sha256(userDTO.Password))) 
                return null;

            return _mapper.Map<UserDTO>(userData);
        }
    }
}
