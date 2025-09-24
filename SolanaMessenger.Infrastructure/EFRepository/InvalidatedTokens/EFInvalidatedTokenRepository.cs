﻿using Microsoft.EntityFrameworkCore;
using SolanaMessenger.Domain.Entities;

namespace SolanaMessenger.Infrastructure.EFRepository
{
    public class EFInvalidatedTokenRepository : EFRepositoryBase<InvalidatedToken>, IInvalidatedTokenRepository
    {
        public EFInvalidatedTokenRepository(EFDataContext context) 
            : base(context) { }

        public async Task<bool> IsTokenPresentAsync(string tokenId)
        {
            return await DbContext.InvalidatedTokens.AnyAsync(t => t.TokenID == tokenId);
        }
    }
}
