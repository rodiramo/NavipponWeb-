import React from "react";
import { Facebook } from "lucide-react";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useTheme } from "@mui/material";

const SocialShareButtons = ({ url }) => {
  const theme = useTheme(); // ✅ Get theme colors

  return (
    <div className="w-full flex gap-3">
      {/* Facebook */}
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/dialog/share?app_id=1180206992856877&display=popup&href=${url}`}
        style={{
          transition: "color 0.3s ease-in-out",
          color: theme.palette.secondary.dark, // Default (inactive) color
        }}
        onMouseEnter={(e) =>
          (e.target.style.color = theme.palette.primary.main)
        }
        onMouseLeave={(e) =>
          (e.target.style.color = theme.palette.secondary.dark)
        }
      >
        <Facebook size={30} />
      </a>

      {/* Twitter (X) */}
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet?url=${url}`}
        style={{
          transition: "color 0.3s ease-in-out",
          color: theme.palette.secondary.dark, // Default color
        }}
        onMouseEnter={(e) =>
          (e.target.style.color = theme.palette.primary.main)
        }
        onMouseLeave={(e) =>
          (e.target.style.color = theme.palette.secondary.dark)
        }
      >
        <XIcon fontSize="large" />
      </a>

      {/* WhatsApp */}
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://api.whatsapp.com/send/?text=${url}`}
        style={{
          transition: "color 0.3s ease-in-out",
          color: theme.palette.secondary.dark, // Default color
        }}
        onMouseEnter={(e) =>
          (e.target.style.color = theme.palette.primary.main)
        }
        onMouseLeave={(e) =>
          (e.target.style.color = theme.palette.secondary.dark)
        }
      >
        <WhatsAppIcon fontSize="large" />
      </a>
    </div>
  );
};

export default SocialShareButtons;
