FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything
COPY . .

# Restore as distinct layers
RUN dotnet restore ICT302-BackendAPI/ICT302-BackendAPI.csproj

# Build a release
RUN dotnet build ICT302-BackendAPI/ICT302-BackendAPI.csproj -c Release -o /out

# Build runtime image
#FROM mcr.microsoft.com/dotnet/aspnet:8.0

FROM build AS publish

RUN dotnet publish ICT302-BackendAPI/ICT302-BackendAPI.csproj -c Release -o /out

FROM base AS final

WORKDIR /App
COPY --from=publish /out .

#ENV DOTNET_EnableDiagnostics=0

#ENTRYPOINT ["dotnet", "DotNet.Docker.dll"]
ENTRYPOINT ["dotnet", "ICT302-BackendAPI.dll"]