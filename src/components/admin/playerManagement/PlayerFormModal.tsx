// src/components/admin/PlayerFormModal.tsx
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
  TextField,
  Box, 
} from '@mui/material';

import FormInput from '../../common/FormInput';
import FormButton from '../../common/FormButton';
import playerService from '../../../services/playerService';
import LoadingSpinner from '../../core/LoadingSpinner';
import  {PlayerRoles,type Player} from '../../../types/palyer';
import type { Team } from '../../../types/team';

// Zod Schema for Player Form
const playerSchema = z.object({
  name: z.string().min(1, 'Player name is required'),
  teamId: z.string().min(1, 'Team is required'),
  role: z.enum(PlayerRoles, {
    errorMap: () => ({ message: 'Player role is required' }),
  }),
});

type PlayerFormInputs = z.infer<typeof playerSchema>;

interface PlayerFormModalProps {
  open: boolean;
  onClose: (player?: Player) => void;
  editingPlayer: Player | null;
  teams: Team[]; // List of teams to select from
  teamsLoading: boolean;
  teamsError: string | null;
}

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  open,
  onClose,
  editingPlayer,
  teams,
  teamsLoading,
  teamsError,
}) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // For team search in dropdown

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormInputs>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: '',
      teamId: '',
      role: undefined, // undefined for no default selection in nativeEnum
    },
  });

  // Populate form when editingPlayer changes
  useEffect(() => {
    if (editingPlayer) {
      reset({
        name: editingPlayer.name,
        teamId: editingPlayer.teamId,
        role: editingPlayer.role,
      });
    } else {
      reset({ name: '', teamId: '', role: undefined });
    }
    setApiError(null);
  }, [editingPlayer, reset, open]);

  const onSubmit = async (data: PlayerFormInputs) => {
    setApiError(null);
    try {
      let savedPlayer: Player;
      if (editingPlayer) {
        const payload = { id: editingPlayer.id, ...data };
        savedPlayer = await playerService.updatePlayer(payload);
      } else {
        const payload = data;
        savedPlayer = await playerService.createPlayer(payload);
      }
      onClose(savedPlayer);
    } catch (err: any) {
      setApiError(err.message || 'Failed to save player.');
      console.error("Save player error:", err);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>{editingPlayer ? 'Edit Player' : 'Add New Player'}</DialogTitle>
      <DialogContent dividers>
        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
        {teamsError && <Alert severity="warning" sx={{ mb: 2 }}>{teamsError}</Alert>}
        {teamsLoading ? (
          <LoadingSpinner message="Loading teams..." />
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
            <FormInput
              {...field}
              label="Player Name"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
              )}
              />

          <Controller
              name="teamId"
              control={control}
              render={({ field }) => (
            <FormInput
              {...field}
              label="Team"
              select
              error={!!errors.teamId}
              helperText={errors.teamId?.message}
              SelectProps={{
                // Add search capability to the team dropdown if many teams
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 224, // Adjust height as needed
                    },
                  },
                },
                renderValue: (selected: unknown) => {
                  const team = teams.find(t => t.id === selected);
                  return team ? team.name : '';
                },
              }}
            >
              <TextField
                placeholder="Search Team"
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mx: 2, my: 1 }}
              />
              {filteredTeams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </FormInput>
              )}
              />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
            <FormInput
              {...field}
              label="Role"
              select
              error={!!errors.role}
              helperText={errors.role?.message}
            >
              {Object.values(PlayerRoles).map((role) => (// from where can i get player role do i need object in constant or what 
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </FormInput>
              )}
              />


          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <FormButton onClick={() => onClose()} color="inherit" disabled={isSubmitting}>
          Cancel
        </FormButton>
        <FormButton onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          {editingPlayer ? 'Save Changes' : 'Add Player'}
        </FormButton>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerFormModal;