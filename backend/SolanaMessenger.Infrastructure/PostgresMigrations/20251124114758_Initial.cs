using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SolanaMessenger.Infrastructure.PostgresMigrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Chat",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", nullable: false),
                    Signatures = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chat", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "InvalidatedToken",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    TokenID = table.Column<string>(type: "varchar(32)", nullable: false),
                    DateExpiration = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvalidatedToken", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Login = table.Column<string>(type: "varchar(50)", nullable: false),
                    Signatures = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Message",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    ChatID = table.Column<Guid>(type: "uuid", nullable: false),
                    Timestamp = table.Column<long>(type: "bigint", nullable: false),
                    Signatures = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Message", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Message_Chat_ChatID",
                        column: x => x.ChatID,
                        principalTable: "Chat",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatUser",
                columns: table => new
                {
                    ChatsID = table.Column<Guid>(type: "uuid", nullable: false),
                    UsersID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatUser", x => new { x.ChatsID, x.UsersID });
                    table.ForeignKey(
                        name: "FK_ChatUser_Chat_ChatsID",
                        column: x => x.ChatsID,
                        principalTable: "Chat",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatUser_User_UsersID",
                        column: x => x.UsersID,
                        principalTable: "User",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatUser_UsersID",
                table: "ChatUser",
                column: "UsersID");

            migrationBuilder.CreateIndex(
                name: "IX_InvalidatedToken_TokenID",
                table: "InvalidatedToken",
                column: "TokenID");

            migrationBuilder.CreateIndex(
                name: "IX_Message_ChatID",
                table: "Message",
                column: "ChatID");

            migrationBuilder.CreateIndex(
                name: "IX_Message_Timestamp",
                table: "Message",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_User_Login",
                table: "User",
                column: "Login",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatUser");

            migrationBuilder.DropTable(
                name: "InvalidatedToken");

            migrationBuilder.DropTable(
                name: "Message");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Chat");
        }
    }
}
