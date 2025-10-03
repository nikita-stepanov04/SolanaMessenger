using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolanaMessenger.Application;
using SolanaMessenger.Application.BusinessServicesInterfaces;
using SolanaMessenger.Application.Cryptography;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Web.Models;

namespace SolanaMessenger.Web.Controllers
{
    [Route("api/user")]
    public class UserController : MessengerControllerBase
    {
        private readonly IUserBS _userBS;
        private readonly ITokenBS _tokenBS;

        public UserController(
            IUserBS userBS,
            ITokenBS tokenBS)
        {
            _userBS = userBS;
            _tokenBS = tokenBS;
        }

        [HttpGet("{login}")]
        public async Task<IActionResult> GetByLogin([FromRoute] string login)
        {
            var user = await _userBS.GetByLoginAsync(login);
            return Ok(user);
        }

        [HttpGet("check-login/{login}")]
        public async Task<IActionResult> CheckLogin([FromRoute] string login)
        {
            var result = await _userBS.IsLoginNotTakenAsync(login);
            return Ok(result);
        }

        [HttpPost("registration")]
        public async Task<IActionResult> Registration([FromBody] UserRegistrationDTO dto)
        {
            var userID = await _userBS.RegisterUserAsync(dto);

            if (userID == Guid.Empty)
                return BadRequest(new MessageResponse("User with specified login has already been registered"));

            return Ok(new IDResponse(userID));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogInDTO dto)
        {
            var user = await _userBS.CheckCredentialsForLoginAsync(dto);

            if (user == null)
                return Unauthorized(new MessageResponse($"Incorrect login or password"));

            var accessToken = _tokenBS.GenerateAccessToken(user);
            var refreshToken = _tokenBS.GenerateRefreshToken();

            return Ok(new TokensResponse(accessToken, refreshToken));
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest req)
        {
            await _tokenBS.RevokeToken(AccessToken);
            await _tokenBS.RevokeToken(req.RefreshToken);

            return Ok();
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest req)
        {
            var accRes = _tokenBS.ValidateAccessTokenForRefresh(AccessToken);
            var refRes = _tokenBS.ValidateRefreshTokenForRefresh(req.RefreshToken);

            if (accRes != null && refRes != null)
            {
                var login = accRes.FirstOrDefault(c => c.Type == JwtClaimType.Login)!.Value;
                var user = await _userBS.GetByLoginAsync(login);

                var newAccToken = _tokenBS.GenerateAccessToken(user!);
                return Ok(new RefreshResponse(newAccToken));
            }
            return BadRequest(new MessageResponse("Failed to validate tokens"));
        }
    }
}
