using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Application.DTOs.Users
{
    public class UserMinDTO : DTOBase
    {
        public Guid ID { get; set; }
        public string Login { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string SecondName { get; set; } = null!;
        public string Patronymic { get; set; } = null!;
        public Role Role { get; set; } = Role.User;
    }
}
