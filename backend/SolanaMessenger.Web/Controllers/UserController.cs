using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SolanaMessenger.Application;
using SolanaMessenger.Application.BusinessServicesInterfaces;
using SolanaMessenger.Application.Cryptography;
using SolanaMessenger.Application.DTOs;
using SolanaMessenger.Application.DTOs.Users;
using SolanaMessenger.Web.Identity;
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
        [ProducesResponseType<UserDTO>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByLogin([FromRoute] string login)
        {
            var user = await _userBS.GetByLoginAsync(login);           
            return user != null 
                ? Ok(user)
                : NotFound();
        }

        [HttpGet("search/{loginSubstring}")]
        [ProducesResponseType<List<UserMinDTO>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchByLoginSubstring([FromRoute] string loginSubstring)
        {
            var users = await _userBS.GetByLoginSubstring(loginSubstring);
            return Ok(users);
        }

        [HttpGet("check-login/{login}")]
        [ProducesResponseType<BoolResponse>(StatusCodes.Status200OK)]
        public async Task<IActionResult> CheckLogin([FromRoute] string login)
        {
            var result = await _userBS.IsLoginNotTakenAsync(login);
            return Ok(new BoolResponse(result));
        }

        [HttpPost("registration")]
        [ProducesResponseType<IDResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<MessageResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Registration([FromBody] UserRegistrationDTO dto)
        {
            var result = await _userBS.RegisterUserAsync(dto);

            if (result.HasError)
                return BadRequest(new MessageResponse(result.ErrorMessage));

            return Ok(new IDResponse(result.Result));
        }

        [HttpPost("login")]
        [ProducesResponseType<TokensResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<MessageResponse>(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] UserLogInDTO dto)
        {
            var user = await _userBS.CheckCredentialsForLoginAsync(dto);

            if (user == null)
                return BadRequest(new MessageResponse($"Incorrect login or password"));

            var accessToken = _tokenBS.GenerateAccessToken(user);
            var refreshToken = _tokenBS.GenerateRefreshToken();

            return Ok(new TokensResponse(accessToken, refreshToken));
        }

        [HttpPost("logout")]
        [Authorize(Policy = Policies.AuthorizedAny)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest req)
        {
            await _tokenBS.RevokeToken(AccessToken);
            await _tokenBS.RevokeToken(req.RefreshToken);

            return Ok();
        }

        [HttpPost("refresh")]
        [ProducesResponseType<RefreshResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType<MessageResponse>(StatusCodes.Status400BadRequest)]
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
