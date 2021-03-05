import Head from "next/head";
import { Link as ChakraLink, Container, Box, StackDivider, VStack, Heading, Text, Avatar, Flex, HStack, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Tag, Select } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'
import useErrorGuardedFetch from "../../hooks/useErrorsGuardedFetch";
import { FeaturedItem, TracksByPlaylistWithFeaturesResponse } from "../../api";
import { Track } from "../../lib/TracksByPlaylistResponse";
import { NumericAudioFeatures } from "../../lib/AudioFeaturesResponse";

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

function TrackCard({ currentSort, track: { name, album: { images } }, features }: TrackCardProps) {
  return (
    <Box p={2} shadow="md" borderWidth="1px" position="relative">
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

export default function PlaylistPage() {
  const router = useRouter()
  const { id } = router.query;

  const [sortingProperty, setSortingProperty] = useState<keyof NumericAudioFeatures>("danceability");


  console.log({ id });

  const path = useMemo(() => id ? `/api/playlists/${id}` : "", [id])

  const { status, data, error } = useErrorGuardedFetch<TracksByPlaylistWithFeaturesResponse>(path);

  console.log({ status, data, error });

  if (status !== "fetched") {
    return null;
  }

  return <Container p="10" maxW="xl">
    <Select mb="10" placeholder="Sort by" onChange={ev => setSortingProperty(ev.currentTarget.value as keyof NumericAudioFeatures)}>
      {numericFeatures.map(featureKey => (
        <option key={featureKey} value={featureKey}>{featureKey}</option>
      ))}
    </Select>
    <VStack
      align="stretch"
    >
      {data.items.sort(sortByFeature(sortingProperty)).map(item => (
        <TrackCard currentSort={sortingProperty} key={item.track.id} track={item.track} features={item.features} />
      ))}
    </VStack>
  </Container>
}


// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }