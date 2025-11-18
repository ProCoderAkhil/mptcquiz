export interface Question {
  id: number;
  category: string;
  difficulty: "basic" | "interesting" | "quiz" | "trivia" | "general";
  question: string;
  options: string[];
  correctAnswer: number;
  source?: string;
}

const SOURCE_GKG = "https://gkgigs.com/general-knowledge-about-india/";
const SOURCE_NHPS = "https://nhps.in/blog/general-knowledge-questions-for-kids/";

const buildQuestion = (
  id: number,
  category: string,
  difficulty: Question["difficulty"],
  question: string,
  options: string[],
  correctAnswer: number,
  source: string = SOURCE_GKG
): Question => ({
  id,
  category,
  difficulty,
  question,
  options,
  correctAnswer,
  source,
});

export const questionBank: Question[] = [
  buildQuestion(1, "National Symbols", "general", "Who wrote the national anthem of India?", [
    "Bankim Chandra Chatterjee",
    "Rabindranath Tagore",
    "Sarojini Naidu",
    "Allama Iqbal",
  ], 1),
  buildQuestion(2, "World Geography", "general", "Which country is known as the ‘Land of the Rising Sun’?", [
    "China",
    "Japan",
    "Korea",
    "Vietnam",
  ], 1),
  buildQuestion(3, "World Geography", "general", "Which is the smallest continent in the world?", [
    "Europe",
    "Australia",
    "Antarctica",
    "South America",
  ], 1),
  buildQuestion(4, "Inventors", "general", "Who invented the telephone?", [
    "Guglielmo Marconi",
    "Thomas Edison",
    "Alexander Graham Bell",
    "Nikola Tesla",
  ], 2),
  buildQuestion(5, "Human Body", "general", "What do humans breathe?", [
    "Nitrogen",
    "Carbon Dioxide",
    "Oxygen",
    "Hydrogen",
  ], 2),
  buildQuestion(6, "World Geography", "interesting", "Which is the longest river in the world?", [
    "Amazon",
    "Yangtze",
    "Mississippi",
    "Nile",
  ], 3),
  buildQuestion(7, "Science Basics", "interesting", "What is the freezing point of water?", [
    "0°C or 32°F",
    "10°C or 50°F",
    "32°C or 90°F",
    "100°C or 212°F",
  ], 0),
  buildQuestion(8, "World Art", "interesting", "Who painted the Mona Lisa?", [
    "Vincent van Gogh",
    "Pablo Picasso",
    "Leonardo da Vinci",
    "Claude Monet",
  ], 2),
  buildQuestion(9, "Sports", "interesting", "What is the national sport of Canada?", [
    "Baseball",
    "Ice Hockey",
    "Basketball",
    "Soccer",
  ], 1),
  buildQuestion(10, "Minerals", "interesting", "Which is the hardest natural substance on Earth?", [
    "Diamond",
    "Steel",
    "Graphite",
    "Quartz",
  ], 0),
  buildQuestion(11, "Calendars", "basic", "How many days are there in a leap year?", [
    "365",
    "366",
    "364",
    "360",
  ], 1),
  buildQuestion(12, "World Geography", "basic", "Which is the tallest mountain in the world?", [
    "K2",
    "Mount Everest",
    "Kangchenjunga",
    "Lhotse",
  ], 1),
  buildQuestion(13, "Science Basics", "basic", "What is the boiling point of water?", [
    "50°C",
    "90°C",
    "100°C",
    "120°C",
  ], 2),
  buildQuestion(14, "Solar System", "basic", "Which planet is closest to the sun?", [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
  ], 0),
  buildQuestion(15, "Wildlife", "basic", "Which is the fastest land animal?", [
    "Lion",
    "Cheetah",
    "Gazelle",
    "Horse",
  ], 1),
  buildQuestion(16, "Indian History", "general", "Who was the first President of India?", [
    "Dr. S. Radhakrishnan",
    "Dr. Rajendra Prasad",
    "Dr. Zakir Husain",
    "V.V. Giri",
  ], 1),
  buildQuestion(17, "Indian History", "general", "When did India gain independence?", [
    "26th January 1950",
    "15th August 1947",
    "2nd October 1947",
    "30th January 1948",
  ], 1),
  buildQuestion(18, "Indian History", "general", "Who is known as the Father of the Nation?", [
    "Subhas Chandra Bose",
    "Jawaharlal Nehru",
    "Mahatma Gandhi",
    "Bhagat Singh",
  ], 2),
  buildQuestion(19, "Indian Constitution", "general", "In which year was the Indian Constitution adopted?", [
    "1947",
    "1948",
    "1949",
    "1950",
  ], 3),
  buildQuestion(20, "Explorers", "general", "Who discovered India by sea route?", [
    "Christopher Columbus",
    "Vasco da Gama",
    "Ferdinand Magellan",
    "Marco Polo",
  ], 1),
  buildQuestion(21, "Chemistry", "easy", "What is the chemical symbol for water?", [
    "H₂O",
    "O₂",
    "CO₂",
    "NaCl",
  ], 0),
  buildQuestion(22, "Botany", "easy", "Which part of the plant makes food?", [
    "Root",
    "Stem",
    "Leaf",
    "Flower",
  ], 2),
  buildQuestion(23, "Human Body", "easy", "How many bones are there in the human body?", [
    "106",
    "206",
    "306",
    "406",
  ], 1),
  buildQuestion(24, "Botany", "easy", "What is the process by which plants make food?", [
    "Respiration",
    "Photosynthesis",
    "Transpiration",
    "Fermentation",
  ], 1),
  buildQuestion(25, "Human Body", "easy", "Which is the largest organ of the human body?", [
    "Heart",
    "Liver",
    "Skin",
    "Lungs",
  ], 2),
  buildQuestion(26, "World Geography", "quiz", "Which is the largest ocean in the world?", [
    "Indian Ocean",
    "Atlantic Ocean",
    "Pacific Ocean",
    "Arctic Ocean",
  ], 2),
  buildQuestion(27, "National Symbols", "quiz", "Which is the national animal of India?", [
    "Lion",
    "Elephant",
    "Bengal Tiger",
    "Peacock",
  ], 2),
  buildQuestion(28, "Demographics", "quiz", "Which country has the largest population in the world?", [
    "India",
    "China",
    "USA",
    "Indonesia",
  ], 0),
  buildQuestion(29, "Indian Railways", "quiz", "Which is the longest railway platform in India?", [
    "Kharagpur",
    "Gorakhpur",
    "Bilaspur",
    "Chennai Central",
  ], 1),
  buildQuestion(30, "World Geography", "quiz", "Which desert is the largest in the world?", [
    "Gobi",
    "Sahara",
    "Arabian",
    "Thar",
  ], 1),
  buildQuestion(31, "Human Body", "quiz", "Which is the smallest bone in the human body?", [
    "Femur",
    "Stapes",
    "Tibia",
    "Radius",
  ], 1),
  buildQuestion(32, "Festivals", "quiz", "Which festival is called the Festival of Lights?", [
    "Holi",
    "Eid",
    "Diwali",
    "Christmas",
  ], 2),
  buildQuestion(33, "National Symbols", "quiz", "What is the national flower of India?", [
    "Rose",
    "Lotus",
    "Lily",
    "Jasmine",
  ], 1),
  buildQuestion(34, "Animals", "quiz", "Which animal is known as the ‘Ship of the Desert’?", [
    "Camel",
    "Horse",
    "Donkey",
    "Elephant",
  ], 0),
  buildQuestion(35, "Sports", "quiz", "How many players are there in a cricket team?", [
    "10",
    "11",
    "12",
    "9",
  ], 1),
  buildQuestion(36, "Astronomy", "trivia", "Which planet is known as the ‘Blue Planet’?", [
    "Mars",
    "Earth",
    "Neptune",
    "Uranus",
  ], 1),
  buildQuestion(37, "Indian Science", "trivia", "Who is known as the Missile Man of India?", [
    "Dr. Vikram Sarabhai",
    "Dr. A.P.J. Abdul Kalam",
    "Dr. Homi Bhabha",
    "Dr. C.V. Raman",
  ], 1),
  buildQuestion(38, "Indian Geography", "trivia", "What is the smallest state in India by area?", [
    "Sikkim",
    "Goa",
    "Tripura",
    "Mizoram",
  ], 1),
  buildQuestion(39, "Cinema", "trivia", "Which is the first Indian movie to win an Oscar?", [
    "Mother India",
    "Lagaan",
    "RRR",
    "Salaam Bombay",
  ], 2),
  buildQuestion(40, "Democracy", "trivia", "Which is the largest democracy in the world?", [
    "USA",
    "India",
    "UK",
    "Australia",
  ], 1),

  // NHPS dataset
  buildQuestion(101, "Indian Geography", "basic", "Which is the national river of India?", [
    "Ganga",
    "Yamuna",
    "Brahmaputra",
    "Godavari",
  ], 0, SOURCE_NHPS),
  buildQuestion(102, "World Geography", "basic", "How many continents are there in the world?", [
    "Five",
    "Six",
    "Seven",
    "Eight",
  ], 2, SOURCE_NHPS),
  buildQuestion(103, "Indian Civics", "basic", "What is the capital of India?", [
    "Mumbai",
    "New Delhi",
    "Kolkata",
    "Bengaluru",
  ], 1, SOURCE_NHPS),
  buildQuestion(104, "Indian Geography", "basic", "Name the two seas surrounding India.", [
    "Arabian Sea and Bay of Bengal",
    "Red Sea and Mediterranean Sea",
    "Caspian Sea and Black Sea",
    "Baltic Sea and North Sea",
  ], 0, SOURCE_NHPS),
  buildQuestion(105, "Indian Geography", "basic", "Which mountain range is in the northern part of India?", [
    "Andes",
    "Himalayas",
    "Rockies",
    "Atlas",
  ], 1, SOURCE_NHPS),
  buildQuestion(106, "World Geography", "basic", "Which is the deepest ocean in the world?", [
    "Atlantic Ocean",
    "Indian Ocean",
    "Pacific Ocean",
    "Arctic Ocean",
  ], 2, SOURCE_NHPS),
  buildQuestion(107, "World Geography", "basic", "Which latitude runs through the centre of the earth?", [
    "Tropic of Cancer",
    "Equator",
    "Prime Meridian",
    "Tropic of Capricorn",
  ], 1, SOURCE_NHPS),
  buildQuestion(108, "World Geography", "basic", "India is a part of which continent?", [
    "Africa",
    "Asia",
    "Europe",
    "Australia",
  ], 1, SOURCE_NHPS),
  buildQuestion(109, "Indian Geography", "basic", "Name the only desert in India.", [
    "Gobi Desert",
    "Thar Desert",
    "Sahara Desert",
    "Namib Desert",
  ], 1, SOURCE_NHPS),
  buildQuestion(110, "World Geography", "basic", "Which is the tallest mountain in the world?", [
    "Mount Everest",
    "K2",
    "Annapurna",
    "Makalu",
  ], 0, SOURCE_NHPS),
  buildQuestion(111, "Science Basics", "basic", "Name the process by which plants prepare food.", [
    "Respiration",
    "Photosynthesis",
    "Transpiration",
    "Fermentation",
  ], 1, SOURCE_NHPS),
  buildQuestion(112, "Science Basics", "basic", "Which gas do humans inhale?", [
    "Carbon dioxide",
    "Oxygen",
    "Nitrogen",
    "Hydrogen",
  ], 1, SOURCE_NHPS),
  buildQuestion(113, "Astronomy", "basic", "Which planet is called the Red Planet?", [
    "Mars",
    "Jupiter",
    "Saturn",
    "Venus",
  ], 0, SOURCE_NHPS),
  buildQuestion(114, "Astronomy", "basic", "The solar system is a part of which galaxy?", [
    "Whirlpool Galaxy",
    "Milky Way Galaxy",
    "Sombrero Galaxy",
    "Pinwheel Galaxy",
  ], 1, SOURCE_NHPS),
  buildQuestion(115, "Astronomy", "basic", "How many planets are there in the solar system?", [
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ], 1, SOURCE_NHPS),
  buildQuestion(116, "Indian History", "basic", "Who is the “Father of our Nation”?", [
    "Netaji Subhas Chandra Bose",
    "Mahatma Gandhi",
    "Bal Gangadhar Tilak",
    "Lala Lajpat Rai",
  ], 1, SOURCE_NHPS),
  buildQuestion(117, "Indian History", "basic", "When did India get independence?", [
    "1945",
    "1946",
    "1947",
    "1948",
  ], 2, SOURCE_NHPS),
  buildQuestion(118, "Indian History", "basic", "When is Republic Day celebrated?", [
    "26 January",
    "15 August",
    "2 October",
    "14 November",
  ], 0, SOURCE_NHPS),
  buildQuestion(119, "Indian History", "basic", "Who built the Taj Mahal?", [
    "Akbar",
    "Shah Jahan",
    "Aurangzeb",
    "Humayun",
  ], 1, SOURCE_NHPS),
  buildQuestion(120, "Indian Literature", "basic", "Who wrote the National Anthem of India?", [
    "Rabindranath Tagore",
    "Bankim Chandra Chatterjee",
    "Sarojini Naidu",
    "Subramania Bharati",
  ], 0, SOURCE_NHPS),
];

const questionLookup = new Map(questionBank.map((question) => [question.id, question]));

export const getQuestionsByIds = (ids: number[]): Question[] =>
  ids
    .map((id) => questionLookup.get(id))
    .filter((question): question is Question => Boolean(question));

export const QUESTION_SOURCES = [SOURCE_GKG, SOURCE_NHPS];
