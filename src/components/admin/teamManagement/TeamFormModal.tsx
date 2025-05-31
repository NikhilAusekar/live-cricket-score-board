// src/components/admin/TeamFormModal.tsx
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  Box
} from '@mui/material';

import playerService from '../../../services/playerService';
import teamService from '../../../services/teamService';
import LoadingSpinner from '../../core/LoadingSpinner';
import FormInput from '../../common/FormInput';
import FormButton from '../../common/FormButton';
import type { CreateTeamPayload, Team, UpdateTeamPayload } from '../../../types/team';
import type { Player, UpdatePlayerPayload } from '../../../types/palyer';



// Zod Schema for Team Form
const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  captainId: z.string().optional(),
});

type TeamFormInputs = z.infer<typeof teamSchema>;

interface TeamFormModalProps {
  open: boolean;
  onClose: (team?: Team) => void; // Pass the updated/new team back
  editingTeam: Team | null; // Null for new, Team object for edit
}

const TeamFormModal: React.FC<TeamFormModalProps> = ({ open, onClose, editingTeam }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState<boolean>(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormInputs>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      captainId: '', // Default to empty string for select
    },
  });

  // Populate form when editingTeam changes
  useEffect(() => {
    if (editingTeam) {
      reset({
        name: editingTeam.name,
        captainId: editingTeam.captainId || '', // Use '' for select
      });
    } else {
      reset({ name: '', captainId: '' }); // Reset for new team
    }
    setApiError(null); // Clear previous errors
  }, [editingTeam, reset, open]); // Reset when modal opens or editingTeam changes

  // Fetch players for the captain dropdown
  useEffect(() => {
    const fetchPlayersForDropdown = async () => {
      setPlayersLoading(true);
      setPlayersError(null);
      try {
        const fetchedPlayers = await playerService.getPlayers(); // Fetch all players
        setPlayers(fetchedPlayers);
      } catch (err: any) {
        setPlayersError(err.message || 'Failed to load players for captain selection.');
        console.error("Fetch players error:", err);
      } finally {
        setPlayersLoading(false);
      }
    };

    if (open) { // Only fetch players when modal is open
      fetchPlayersForDropdown();
    }
  }, [open]);

  const onSubmit = async (data: TeamFormInputs) => {
    setApiError(null);
    try {
      let savedTeam: Team;
      if (editingTeam) {
        const payload: UpdateTeamPayload = { id: editingTeam.id, ...data };// type error
        savedTeam = await teamService.updateTeam(payload);
      } else {
        const payloadTeam: CreateTeamPayload = data;
        savedTeam = await teamService.createTeam(payloadTeam);
      }
      onClose(savedTeam); // Pass the saved team back to parent
    } catch (err: any) {
      setApiError(err.message || 'Failed to save team.');
      console.error("Save team error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{editingTeam ? 'Edit Team' : 'Add New Team'}</DialogTitle>
      <DialogContent dividers>
        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
        {playersError && <Alert severity="warning" sx={{ mb: 2 }}>{playersError}</Alert>}
        {playersLoading ? (
          <LoadingSpinner message="Loading players..." />
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Team Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="captainId"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Captain (Optional)"
                    select
                    error={!!errors.captainId}
                    helperText={errors.captainId?.message}
                  />
                )}
              />

              <MenuItem value=""><em>None</em></MenuItem>
              {players.map((player) => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name} ({player.teamName}) {/* Show team name for clarity */}
                </MenuItem>
              ))}

          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <FormButton onClick={() => onClose()} color="inherit" disabled={isSubmitting}>// we are supposed to pass the team object here in onClose(team)
          Cancel
        </FormButton>
        <FormButton onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          {editingTeam ? 'Save Changes' : 'Add Team'}
        </FormButton>
      </DialogActions>
    </Dialog>
  );
};

export default TeamFormModal;