FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["SolanaMessenger.Web/SolanaMessenger.Web.csproj", "SolanaMessenger.Web/"]
COPY ["SolanaMessenger.Application/SolanaMessenger.Application.csproj", "SolanaMessenger.Application/"]
COPY ["SolanaMessenger.Infrastructure.Blockchain/SolanaMessenger.Infrastructure.Blockchain.csproj", "SolanaMessenger.Infrastructure.Blockchain/"]
COPY ["SolanaMessenger.Domain/SolanaMessenger.Domain.csproj", "SolanaMessenger.Domain/"]
COPY ["SolanaMessenger.Infrastructure/SolanaMessenger.Infrastructure.csproj", "SolanaMessenger.Infrastructure/"]
RUN dotnet restore "./SolanaMessenger.Web/SolanaMessenger.Web.csproj"
COPY . .
WORKDIR "/src/SolanaMessenger.Web"
RUN dotnet build "./SolanaMessenger.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./SolanaMessenger.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SolanaMessenger.Web.dll"]