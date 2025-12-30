namespace SolanaMessenger.Domain.Entities
{
    public class UserData : EntityBase
    {
        public string Login { get; set; } = null!;
        public byte[] PasswordHash { get; set; } = null!;
        public byte[] Salt { get; set; } = null!;
        public byte[] X25519Pub { get; set; } = null!;
        public Role Role { get; set; } = Role.User;
        public string FirstName { get; set; } = null!;
        public string SecondName { get; set; } = null!;
        public string Patronymic { get; set; } = null!;
    }
}
