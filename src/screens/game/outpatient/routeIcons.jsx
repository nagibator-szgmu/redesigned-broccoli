import React from "react";
import {
  IconPill,
  IconUser,
  IconHospital,
  IconAmbulance,
  IconBed,
  IconCardiac,
  IconRoute,
  IconAlertTriangle,
} from "../../../ui/icons";

export const ROUTE_ICONS = {
  treat_outpatient: <IconPill size={18} color="currentColor" />,
  refer_specialist: <IconUser size={18} color="currentColor" />,
  refer_hospitalization: <IconHospital size={18} color="currentColor" />,
  call_ems: <IconAmbulance size={18} color="currentColor" />,
  stationary: <IconBed size={18} color="currentColor" />,
  icu: <IconCardiac size={18} color="currentColor" />,
  home: <IconRoute size={18} color="currentColor" />,
  urgent_surgery: <IconAlertTriangle size={18} color="currentColor" />,
};
