using AutoMapper;
using Microsoft.Extensions.Options;
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

        private readonly AdminSettings _adminSettings;

        public UserBS(
            IMapper mapper,
            IUserRepository userRep,
            IBlockchainRepository<UserData> blockchainRep,
            IOptions<AdminSettings> adminOpts)
        {
            _mapper = mapper;
            _userRep = userRep;
            _blockchainRep = blockchainRep;
            _adminSettings = adminOpts.Value;
        }

        public async Task<UserDTO?> GetByLoginAsync(string login)
        {
            var user = await _userRep.GetByLoginAsync(login);

            var userData = user != null 
                ? await _blockchainRep.GetObjectAsync(user.Signatures)
                : null;

            return _mapper.Map<UserDTO?>(userData);
        }

        public async Task<OperationResult<Guid>> RegisterUserAsync(UserRegistrationDTO userDTO)
        {
            var userData = _mapper.Map<UserData>(userDTO);

            if (!await IsLoginNotTakenAsync(userData.Login))
            {
                return OperationResult.Error<Guid>("Login is already taken");
            }
            else if (
                userDTO.Role == Role.Admin &&
                userDTO.MasterPassword != _adminSettings.AdminMasterPassword)
            {
                return OperationResult.Error<Guid>("Invalid master password for admin registration");
            }            

            var id = Guid.NewGuid();
            userData.ID = id;

            var hashRes = Hashing.PBKDF2(userDTO.Password);
            userData.PasswordHash = hashRes.Hash;
            userData.Salt = hashRes.Salt;

            var signatures = await _blockchainRep.WriteObjectAsync(userData);
            if (signatures == null) 
                return OperationResult.Error<Guid>();

            var user = new User
            {
                ID = id,
                Login = userData.Login,
                Signatures = signatures
            };

            await _userRep.AddAsync(user);
            await _userRep.SaveChangesAsync();
            return OperationResult.Success(user.ID);           
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

            if (userData == null) return null;

            var reqPasswordHashRes = Hashing.PBKDF2(userDTO.Password, userData.Salt);
            if (!reqPasswordHashRes.Hash.SequenceEqual(userData.PasswordHash))
                return null;

            return _mapper.Map<UserDTO>(userData);
        }
    }    
}
