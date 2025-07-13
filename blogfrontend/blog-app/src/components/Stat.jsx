import { Card, CardContent, CardHeader, Icon, Typography } from '@mui/material';
import '../styles/Stat.scss';

function Stat({ stat = {} }) {

  const { icon, value, label, color } = stat;

  return (
    <Card sx={{flex: 1, minWidth: 200, maxWidth: 300, padding: '0 .7rem'}} >
      <CardHeader
        title={label}
        sx={{ fontWeight: 'bold' }}
      />
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{fontSize: '2.5rem', fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Icon sx={{fontSize: '2rem', color: color}}>{icon}</Icon>
      </CardContent>
    </Card>
  );
}

export default Stat