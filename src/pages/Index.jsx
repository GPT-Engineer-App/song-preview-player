import { useState } from "react";
import { Box, Button, Heading, Input, Text, VStack, Image } from "@chakra-ui/react";
import { FaSearch, FaPlay, FaPause } from "react-icons/fa";

const CLIENT_ID = "4642e3fdf761477991140a71ec36597e";
const CLIENT_SECRET = "1f1ef85b93cc467290f77cdcca6b5cd1";

const Index = () => {
  const [accessToken, setAccessToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);

  const getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    setAccessToken(data.access_token);
  };

  const searchSongs = async () => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    setSearchResults(data.tracks.items);
  };

  const playPreview = (url) => {
    if (audioPlayer) {
      audioPlayer.pause();
    }

    const audio = new Audio(url);
    audio.play();
    setAudioPlayer(audio);
    setPreviewUrl(url);
    setIsPlaying(true);
  };

  const pausePreview = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        Spotify Song Search
      </Heading>

      {!accessToken && (
        <Button onClick={getAccessToken} colorScheme="green" mb={8}>
          Authorize with Spotify
        </Button>
      )}

      {accessToken && (
        <VStack spacing={4} align="stretch">
          <Input placeholder="Search for a song" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Button leftIcon={<FaSearch />} onClick={searchSongs} colorScheme="blue">
            Search
          </Button>

          {searchResults.map((track) => (
            <Box key={track.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
              <Image src={track.album.images[0].url} alt="Album Cover" mb={4} />
              <Heading as="h2" size="md" mb={2}>
                {track.name}
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                {track.artists.map((artist) => artist.name).join(", ")}
              </Text>
              {previewUrl === track.preview_url && isPlaying ? (
                <Button leftIcon={<FaPause />} onClick={pausePreview} colorScheme="red" size="sm">
                  Pause Preview
                </Button>
              ) : (
                <Button leftIcon={<FaPlay />} onClick={() => playPreview(track.preview_url)} colorScheme="green" size="sm">
                  Play Preview
                </Button>
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Index;
