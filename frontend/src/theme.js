export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F5F5F5",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#F2F2F2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    0: "#FFFFFF",
    10: "#FFE4E7",
    20: "#FFE0E9",
    50: "#FFB3C1",
    100: "#FF9CAA",
    200: "#FF85A3",
    300: "#FF6E8C",
    400: "#FF5775",
    500: "#FF4081", // Primary pink Navippon
    600: "#E63675",
    700: "#CC2D69",
    800: "#B3245D",
    900: "#991B51",
  },
  success: {
    50: "#E6F4EA",
    100: "#C3E6CB",
    200: "#A8D5A4",
    300: "#84C485",
    400: "#5AB75A",
    500: "#28A745", // Success green
    600: "#218838",
    700: "#1B7A30",
    800: "#146C27",
    900: "#0F5E20",
  },
  error: {
    50: "#FDECEA",
    100: "#F8D7DA",
    200: "#F1AEB5",
    300: "#EA868F",
    400: "#E14D5C",
    500: "#DC3545", // Error red
    600: "#C82333",
    700: "#B21E2A",
    800: "#9A1623",
    900: "#82101C",
  },
  warning: {
    50: "#FFF3CD",
    100: "#FFE69C",
    200: "#FFD666",
    300: "#FFC733",
    400: "#FFB400",
    500: "#FFA500", // Warning orange
    600: "#E69500",
    700: "#CC8500",
    800: "#B37400",
    900: "#996300",
  },
  lightBlue: {
    50: "#D7EDFC",
    100: "#CBE3EB",
    200: "#CDD9E1",
    300: "#8BBBD3",
    400: "#6CA7C7",
    500: "#96C6D9",
    600: "#5893AF",
    700: "#407797",
    800: "#305D7F",
    900: "#204167",
  },
  darkBlue: {
    50: "#E0E5EB",
    100: "#B3BED1",
    200: "#8195B5",
    300: "#4F6D98",
    400: "#2A4E83",
    500: "#102651",
    600: "#0E2147",
    700: "#0C1C3D",
    800: "#0A1733",
    900: "#08112A",
  },
};

// MUI Theme Settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              dark: colorTokens.primary[200],
              main: colorTokens.primary[500],
              mid: colorTokens.primary[800],
              light: colorTokens.primary[300],
              white: colorTokens.darkBlue[600],
              black: colorTokens.grey[0],
            },
            secondary: {
              dark: colorTokens.darkBlue[200],
              main: colorTokens.darkBlue[500],
              light: colorTokens.darkBlue[800],
            },
            success: {
              dark: colorTokens.success[700],
              main: colorTokens.success[500],
              light: colorTokens.success[300],
            },
            error: {
              dark: colorTokens.error[700],
              main: colorTokens.error[500],
              light: colorTokens.error[300],
            },
            warning: {
              dark: colorTokens.warning[700],
              main: colorTokens.warning[500],
              light: colorTokens.warning[300],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.darkBlue[900],
              alt: colorTokens.darkBlue[800],
              light: colorTokens.lightBlue[900],
              grey: colorTokens.grey[800],
              nav: colorTokens.darkBlue[800],
            },
          }
        : {
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              mid: colorTokens.primary[100],
              medium: colorTokens.primary[50],
              light: colorTokens.primary[20],
              white: colorTokens.primary[0],
              black: colorTokens.grey[1000],
            },
            secondary: {
              dark: colorTokens.darkBlue[800],
              main: colorTokens.lightBlue[500],
              bg: colorTokens.lightBlue[200],
              medium: colorTokens.lightBlue[600],
              light: colorTokens.darkBlue[50],
            },
            success: {
              dark: colorTokens.success[700],
              main: colorTokens.success[500],
              light: colorTokens.success[100],
            },
            error: {
              dark: colorTokens.error[700],
              main: colorTokens.error[500],
              light: colorTokens.error[200],
            },
            warning: {
              dark: colorTokens.warning[700],
              main: colorTokens.warning[500],
              light: colorTokens.warning[300],
            },
            neutral: {
              dark: colorTokens.grey[1000],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[0],
              light: colorTokens.lightBlue[100],
              alt: colorTokens.grey[10],
              grey: colorTokens.grey[200], // Added grey token for light mode
              nav: colorTokens.darkBlue[800],
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["SifonnPro", "sans-serif"].join(","),
        fontSize: 50,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 35,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 30,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 25,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
    },
  };
};
