using SolanaMessenger.Infrastructure.Blockchain;

namespace SolanaMessenger.Tests.SolanaTests
{
    public class SolanaTests : SolanaBaseTest
    {
        const int SIGNATURE_LENGTH = 64;
        private readonly IBlockchainRepository<TestClass> _repo;
        public SolanaTests(IBlockchainRepository<TestClass> repo)
        {
            _repo = repo;
        }

        [Theory]
        [MemberData(nameof(ValidTestObjects))]
        public async Task BlockchainRepository_Should_WriteAndReadValidObjects(TestClass obj)
        {
            var signatures = await _repo.WriteObjectAsync(obj);
            var length = signatures!.Length / SIGNATURE_LENGTH;

            var received = await _repo.GetObjectAsync(signatures!);

            Assert.Equal(obj.SignsCount, length);
            Assert.Equal(obj, received);
        }

        [Theory]
        [MemberData(nameof(InvalidTestObjects))]
        public async Task BlockchainRepository_ShouldNot_WriteInvalidObjects(TestClass obj)
        {
            await Assert.ThrowsAsync<ObjectTooLargeException>(
                async () => await _repo.WriteObjectAsync(obj));
        }

        public static IEnumerable<object[]> ValidTestObjects = new List<object[]>
        {
            new object[] { new TestClass(1, GetRandomString(5)) },
            new object[] { new TestClass(1, GetRandomString(900)) },
            new object[] { new TestClass(2, GetRandomString(1100)) },
            new object[] { new TestClass(10, GetRandomString(9_000)) }
        };

        public static IEnumerable<object[]> InvalidTestObjects = new List<object[]>
        {
            new object[] {new TestClass(0, GetRandomString(10_000)) }
        };
    }

    public record TestClass
    {
        public int SignsCount { get; set; }
        public string? Text { get; set; }

        public TestClass() { }
        public TestClass(int count, string text)
        {
            SignsCount = count;
            Text = text;
        }
    };
}
