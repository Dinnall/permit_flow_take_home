const questions = [
    {
      id: 1,
      text: "What residential work are you doing?",
      options: ["Interior work", "Exterior work"],
      nextQuestionId: {
        "Interior work": 2,
        "Exterior work": 3,
      },
    },
    {
      id: 2,
      text: "What interior work are you doing?",
      options: ["Bathroom remodel", "New bathroom", "New laundry room", "Other"],
      nextQuestionId: null,
    },
    {
      id: 3,
      text: "What exterior work are you doing?",
      options: ["Garage door replacement", "Exterior doors", "Fencing", "Other"],
      nextQuestionId: null,
    },
  ];
  
  export default questions;