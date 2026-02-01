namespace SolanaMessenger.Application.DTOs
{
    public class ChatUsersDataDTO
    {
        public Guid ID { get; set; }
        public string FirstName { get; set; } = null!;
        public string SecondName { get; set; } = null!;
        public string Patronymic { get; set; } = null!;
    }
}
