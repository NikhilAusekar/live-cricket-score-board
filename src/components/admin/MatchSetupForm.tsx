// src/components/admin/MatchSetupForm.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Container, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import { type SelectOption } from '../../types/match';
import useMatches from '../../hooks/useMatches';
import useTeams from '../../hooks/useTeams';
import usePlayers from '../../hooks/usePlayers';
import LoadingSpinner from '../core/LoadingSpinner';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ErrorDisplay from '../common/ErrorDisplay';
import DataSelect from '../common/DateSelect';

const matchStatus = ['Upcoming', 'Ongoing', 'Completed', 'Undefined'] as const;

const matchSchema = z.object({
  name: z.string().min(1, 'Match name is required'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  team1Id: z.string().min(1, 'Team 1 is required'),
  team2Id: z.string().min(1, 'Team 2 is required'),
  oversPerInnings: z.coerce.number({
    required_error: 'Overs are required',
    invalid_type_error: 'Overs must be a number',
  }).int().min(1).max(99),
  status: z.enum(matchStatus).default('Upcoming'),
  tossWinnerId: z.string().optional(),
  tossDecision: z.enum(['Bat', 'Bowl']).optional(),
  manOfTheMatchPlayerId: z.string().optional(),
}).refine(data => data.team1Id !== data.team2Id, {
  message: 'Team 1 and Team 2 cannot be the same',
  path: ['team2Id'],
});


// Derive type from schema
type MatchFormInputs = z.infer<typeof matchSchema>;

const MatchSetupForm: React.FC = () => {
  const { matchId } = useParams<{ matchId?: string }>();
  const navigate = useNavigate();

  const { matches, loading: matchesLoading, error: matchesError, addMatch, updateMatchInList } = useMatches();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();
  const { players, loading: playersLoading, error: playersError } = usePlayers();

  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MatchFormInputs>({
    resolver: zodResolver(matchSchema as any),
  });

  const watchStatus = watch('status');
  const watchTeam1Id = watch('team1Id');
  const watchTeam2Id = watch('team2Id');

  const teamOptions: SelectOption[] = teams.map(team => ({ value: team.id, label: team.name }));

  // Filter players based on selected teams for Man of the Match dropdown
  const getPlayersForTeams = (teamIds: string[]): SelectOption[] => {
    return players
      .filter(player => teamIds.includes(player.teamId))
      .map(player => ({ value: player.id, label: player.name }));
  };

  const availableMOMPlayers: SelectOption[] =
    (watchTeam1Id && watchTeam2Id)
      ? getPlayersForTeams([watchTeam1Id, watchTeam2Id])
      : [];

  useEffect(() => {
    // Populate form if editing an existing match
    if (matchId && !matchesLoading && matches) {
      const existingMatch = matches.find(m => m.id === matchId);
      if (existingMatch) {
        reset({
          name: existingMatch.name,
          date: existingMatch.date, // This will be ISO string
          venue: existingMatch.venue,
          team1Id: existingMatch.team1Id,
          team2Id: existingMatch.team2Id,
          oversPerInnings: existingMatch.oversPerInnings,
          status: existingMatch.status,
          tossWinnerId: existingMatch.tossWinnerId || '',
          tossDecision: existingMatch.tossDecision || undefined,
          manOfTheMatchPlayerId: existingMatch.manOfTheMatchPlayerId || '',
        });
        // Special handling for DatePicker
        setValue('date', new Date(existingMatch.date).toISOString().split('T')[0]); // Set to YYYY-MM-DD for simple input
      } else {
        setFormError("Match not found.");
      }
    } else if (!matchId) {
      // Reset form for new match creation
      reset();
    }
  }, [matchId, matches, matchesLoading, reset, setValue]);

  const onSubmit = async (data: MatchFormInputs) => {
    setFormError(null);
    try {
      if (matchId) {
        await updateMatchInList(data as any);
        alert('Match updated successfully!');
      } else {
        await addMatch(data as any);
        alert('Match created successfully!');
      }
      navigate('/admin'); // Redirect back to match list
    } catch (err: any) {
      setFormError(err.message || 'Failed to save match details.');
    }
  };

  if (matchesLoading || teamsLoading || playersLoading) {
    return <LoadingSpinner message="Loading match data..." />;
  }

  if (matchesError || teamsError || playersError) {
    return <ErrorDisplay message={matchesError || teamsError || playersError || "Failed to load dependencies for match form."} title={''} onRetry={function (): void {
      throw new Error('Function not implemented.');
    }} />;
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {matchId ? 'Edit Match Details' : 'Create New Match'}
        </Typography>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" onSubmit={handleSubmit(() => onSubmit)} noValidate>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Match Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="datetime-local"
                  fullWidth
                  label="Match Date"
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
            <Controller
              name="venue"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Venue"
                  error={!!errors.venue}
                  helperText={errors.venue?.message}
                />
              )}
            />
            <Controller
              name="team1Id"
              control={control}
              render={({ field }) => (
                <DataSelect
                  {...field}
                  label="Team 1"
                  options={teamOptions}
                  error={!!errors.team1Id}
                  helperText={errors.team1Id?.message}
                />
              )}
            />
            <Controller
              name="team2Id"
              control={control}
              render={({ field }) => (
                <DataSelect
                  {...field}
                  label="Team 2"
                  options={teamOptions.filter(opt => opt.value !== watchTeam1Id)}
                  error={!!errors.team2Id}
                  helperText={errors.team2Id?.message}
                />
              )}
            />
            <Controller
              name="oversPerInnings"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Overs per Innings"
                  type="number"
                  error={!!errors.oversPerInnings}
                  helperText={errors.oversPerInnings?.message}
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <DataSelect
                  {...field}
                  label="Match Status"
                  options={[
                    { value: 'Upcoming', label: 'Upcoming' },
                    { value: 'Ongoing', label: 'Ongoing' },
                    { value: 'Completed', label: 'Completed' },
                  ]}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                />
              )}
            />

            {(watchStatus === 'Ongoing' || watchStatus === 'Completed') && (
              <>
                <Controller
                  name="tossWinnerId"
                  control={control}
                  render={({ field }) => (
                    <DataSelect
                      {...field}
                      label="Toss Winner"
                      options={
                        (watchTeam1Id && watchTeam2Id)
                          ? teamOptions.filter(opt => opt.value === watchTeam1Id || opt.value === watchTeam2Id)
                          : []
                      }
                      error={!!errors.tossWinnerId}
                      helperText={errors.tossWinnerId?.message}
                    />
                  )}
                />

                <Controller
                  name="tossDecision"
                  control={control}
                  render={({ field }) => (
                    <DataSelect
                      {...field}
                      label="Toss Decision"
                      options={[
                        { value: 'Bat', label: 'Bat' },
                        { value: 'Bowl', label: 'Bowl' },
                      ]}
                      error={!!errors.tossDecision}
                      helperText={errors.tossDecision?.message}
                    />
                  )}
                />
              </>
            )}

            {watchStatus === 'Completed' && (
              <Controller
                name="manOfTheMatchPlayerId"
                control={control}
                render={({ field }) => (
                  <DataSelect
                    {...field}
                    label="Man of the Match"
                    options={availableMOMPlayers}
                    error={!!errors.manOfTheMatchPlayerId}
                    helperText={errors.manOfTheMatchPlayerId?.message}
                  />
                )}
              />
            )}

            <FormButton loading={isSubmitting}>
              {matchId ? 'Update Match' : 'Create Match'}
            </FormButton>
          </Box>
        </LocalizationProvider>
      </Box>
    </Container>
  );
};

export default MatchSetupForm;