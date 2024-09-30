import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Textarea,
  Button,
  Grid,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { LockIcon, RepeatIcon, CopyIcon } from '@chakra-ui/icons';

const AnonymizationService = () => {
  const [inputText, setInputText] = useState('');
  const [anonymizedText, setAnonymizedText] = useState('');
  const [mapping, setMapping] = useState([]);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleAnonymize = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/anonymize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAnonymizedText(data.anonymized_text);
      setMapping(data.mapping);
      setError('');
    } catch (err) {
      setError('An error occurred during anonymization');
      console.error(err);
    }
  };

  const handleDeanonymize = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/deanonymize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymized_text: anonymizedText, mapping }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInputText(data.text);
      setError('');
    } catch (err) {
      setError('An error occurred during deanonymization');
      console.error(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="1200px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" marginBottom={4}>Anonymization Service 🕵️‍♀️</Heading>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <Box borderWidth={1} borderRadius="lg" padding={4}>
          <Heading as="h2" size="md" marginBottom={2}>Original Text 📝</Heading>
          <VStack spacing={4}>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              size="lg"
              minHeight="200px"
            />
            <Button leftIcon={<LockIcon />} colorScheme="blue" onClick={handleAnonymize}>
              Anonymize
            </Button>
            <Button leftIcon={<CopyIcon />} variant="outline" onClick={() => copyToClipboard(inputText)}>
              Copy
            </Button>
          </VStack>
        </Box>
        <Box borderWidth={1} borderRadius="lg" padding={4}>
          <Heading as="h2" size="md" marginBottom={2}>Anonymized Text 🔒</Heading>
          <VStack spacing={4}>
            <Textarea
              value={anonymizedText}
              onChange={(e) => setAnonymizedText(e.target.value)}
              placeholder="Anonymized text will appear here..."
              size="lg"
              minHeight="200px"
            />
            <Button leftIcon={<RepeatIcon />} colorScheme="green" onClick={handleDeanonymize}>
              Deanonymize
            </Button>
            <Button leftIcon={<CopyIcon />} variant="outline" onClick={() => copyToClipboard(anonymizedText)}>
              Copy
            </Button>
          </VStack>
        </Box>
      </Grid>
      {error && (
        <Alert status="error" marginTop={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default AnonymizationService;
