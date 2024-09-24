//   <Button
//           onClick={() => handleTimeNow("timeIn")}
//           style={
//             formData.timeIn ? styles.timeButton : styles.timeButtonUnactive
//           }
//         >
//           Time In Now
//         </Button>
//         <Button
//           onClick={() => handleTimeNow("timeOut")}
//           style={
//             formData.timeOut ? styles.timeButton : styles.timeButtonUnactive
//           }
//         >
//           Time Out Now
//         </Button>

const handleTimeNow = (field) => {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  setFormData({ ...formData, [field]: timeString });
};
