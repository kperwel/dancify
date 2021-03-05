import Head from "next/head";
import { Link as ChakraLink, Container, Box, StackDivider, VStack, Heading, Text, Avatar, Flex, HStack, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Tag, Select, Skeleton } from "@chakra-ui/react";
import React, { useCallback, useMemo, useState } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'
import useErrorGuardedFetch from "../../hooks/useErrorsGuardedFetch";
import { FeaturedItem, TracksByPlaylistWithFeaturesResponse } from "../../api";
import { Track } from "../../lib/TracksByPlaylistResponse";
import { NumericAudioFeatures } from "../../lib/AudioFeaturesResponse";
import axios from "axios";

const sortByFeature = (property: keyof NumericAudioFeatures) => (a: FeaturedItem, b: FeaturedItem) => b.features[property] - a.features[property];

const numericFeatures: Array<keyof NumericAudioFeatures> = [
  "danceability",
  "energy",
  "key",
  "loudness",
  "mode",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
  "tempo",
  "duration_ms",
  "time_signature",
]

interface TrackCardProps extends FeaturedItem {
  currentSort: keyof NumericAudioFeatures
}

function TrackCard({ currentSort, track: { id, name, album: { images } }, features }: TrackCardProps) {

  const play = useCallback(async () => {
    try {
      await axios.put("/api/track/play", { id });
    } catch (err) {
      console.error("No device is currently playing");
    }
  }, [id])

  return (
    <Box p={2} shadow="md" cursor="pointer" onClick={play} borderWidth="1px" position="relative">
      <HStack>
        <Avatar alignSelf="flex-end" src={images[2]?.url} />
        <Heading fontSize="xl">{name}</Heading>
      </HStack>
      <StatGroup>
        {Object.entries(features).filter(([key, _value]) => [currentSort, "danceability", "energy", "tempo"].includes(key)).map(([key, value]) => (
          <Stat key={key}>
            <StatLabel textTransform="capitalize">{key}</StatLabel>
            <StatNumber>{value}</StatNumber>
          </Stat>
        ))}

      </StatGroup>
      <Box backgroundImage={`url(${images[1]?.url})`} position="absolute" top="0" left="0" right="0" bottom="0" zIndex="-1" pointerEvents="none" opacity="0.1" filter="blur(2px)" />
    </Box>
  )
}

function MockedTrackCard() {
  return (
    <Box p={2} shadow="md" borderWidth="1px" position="relative">
      <HStack>
        <Avatar alignSelf="flex-end" />
        <Heading fontSize="xl">
          <Skeleton height="20px" width={Math.random() * 100 + 100} />
        </Heading>
      </HStack>
      <StatGroup mt="5px">
        {Array(3).fill(null).map((_, key) => (
          <Stat key={key}>
            <StatLabel textTransform="capitalize"><Skeleton width="50px" height="16px" /></StatLabel>
            <StatNumber><Skeleton width="80px" mt="10px" height="24px" /></StatNumber>
          </Stat>
        ))}
      </StatGroup>
    </Box>
  )
}

const Content = ({ children, onSortingChange, currentSort }: { currentSort: keyof NumericAudioFeatures, children: React.ReactNode, onSortingChange: (feature: keyof NumericAudioFeatures) => void }) => <Container p="10" maxW="xl">
  <Select mb="10" value={currentSort} placeholder="Sort by" onChange={ev => onSortingChange(ev.currentTarget.value as keyof NumericAudioFeatures)}>
    {numericFeatures.map(featureKey => (
      <option key={featureKey} value={featureKey}>{featureKey}</option>
    ))}
  </Select>
  <VStack
    align="stretch"
  >
    {children}
  </VStack>
</Container>

export default function PlaylistPage() {
  const router = useRouter()
  const { id } = router.query;

  const [sortingProperty, setSortingProperty] = useState<keyof NumericAudioFeatures>("danceability");


  const path = useMemo(() => id ? `/api/playlists/${id}` : "", [id])

  const { status, data, error } = useErrorGuardedFetch<TracksByPlaylistWithFeaturesResponse>(path);

  const mock = useMemo(() => Array(10).fill(null).map((_, key) => <MockedTrackCard key={key} />), []);

  return <Content currentSort={sortingProperty} onSortingChange={setSortingProperty}>
    {status !== "fetched" ? mock : (
      data.items.sort(sortByFeature(sortingProperty)).map(item => (
        <TrackCard currentSort={sortingProperty} key={item.track.id} track={item.track} features={item.features} />
      ))
    )}
  </Content>
}


// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }