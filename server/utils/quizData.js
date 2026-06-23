export const quizData = {
  React: [
    {
      id: 1,
      question: "Which of the following is used to pass data to a component from outside?",
      options: ["setState", "render", "props", "PropTypes"],
      correctIndex: 2
    },
    {
      id: 2,
      question: "What is the purpose of useEffect hook in React?",
      options: ["To perform side effects", "To update state value", "To register context value", "To handle form submissions"],
      correctIndex: 0
    },
    {
      id: 3,
      question: "What does JSX stand for?",
      options: ["JS Extension", "JavaScript XML", "Java Syntax Extension", "JavaScript HTML"],
      correctIndex: 1
    },
    {
      id: 4,
      question: "Which hook is used to access the context values in React?",
      options: ["useContext", "useReducer", "useState", "useRef"],
      correctIndex: 0
    },
    {
      id: 5,
      question: "What is the virtual DOM in React?",
      options: ["A direct copy of the HTML DOM", "An in-memory representation of real DOM elements", "A browser extension", "A React library to compile HTML"],
      correctIndex: 1
    },
    {
      id: 6,
      question: "How do you specify a key for rendering list elements in React?",
      options: ["Using the 'id' attribute", "Using the 'index' attribute only", "Using the special 'key' prop", "Using state arrays index"],
      correctIndex: 2
    },
    {
      id: 7,
      question: "Which lifecycle method corresponds to useEffect with an empty dependency array?",
      options: ["componentDidMount", "componentWillUnmount", "componentDidUpdate", "render"],
      correctIndex: 0
    },
    {
      id: 8,
      question: "What is the correct syntax to define a functional component in React?",
      options: ["class MyComp extends Component", "function MyComp() { return <div />; }", "const MyComp = new React()", "createReactComponent('MyComp')"],
      correctIndex: 1
    },
    {
      id: 9,
      question: "What is the purpose of React.memo?",
      options: ["To store temporary notes", "To cache API response values", "To memoize functional component rendering output", "To register hook dependencies"],
      correctIndex: 2
    },
    {
      id: 10,
      question: "How do you update state in a React functional component?",
      options: ["this.setState()", "state = newValue", "Using the setter function returned by useState", "forceUpdate()"],
      correctIndex: 2
    }
  ],
  Node: [
    {
      id: 1,
      question: "Which module is used to create a web server in Node.js?",
      options: ["fs", "url", "http", "path"],
      correctIndex: 2
    },
    {
      id: 2,
      question: "What is the NPM command to initialize a new Node project?",
      options: ["npm start", "npm init", "npm install", "npm run"],
      correctIndex: 1
    },
    {
      id: 3,
      question: "Which of the following is true about Node.js single-threaded event loop?",
      options: ["It executes all operations in parallel", "It processes non-blocking I/O operations asynchronously", "It creates new threads for every client request", "It executes only one I/O operation at a time"],
      correctIndex: 1
    },
    {
      id: 4,
      question: "How do you import a module in CommonJS format in Node.js?",
      options: ["import moduleName from 'module'", "require('module')", "include('module')", "load('module')"],
      correctIndex: 1
    },
    {
      id: 5,
      question: "What is the purpose of the 'process' object in Node.js?",
      options: ["To represent running subprocesses", "To access details about the current running process environment", "To compile Javascript code", "To initialize server endpoints"],
      correctIndex: 1
    },
    {
      id: 6,
      question: "Which method is used to read file contents asynchronously in Node.js?",
      options: ["fs.readFileSync", "fs.readFile", "fs.openFile", "fs.getData"],
      correctIndex: 1
    },
    {
      id: 7,
      question: "What are Streams in Node.js?",
      options: ["Visual rendering tools", "Sequenced arrays of data chunks", "Objects that let you read or write data continuously", "Browser socket streams"],
      correctIndex: 2
    },
    {
      id: 8,
      question: "What is the purpose of module.exports in Node.js?",
      options: ["To publish packages to npm registry", "To export functions/variables from a file module", "To register server middlewares", "To declare global variables"],
      correctIndex: 1
    },
    {
      id: 9,
      question: "Which event emitter method is used to trigger an event listener?",
      options: ["on()", "emit()", "addListener()", "fire()"],
      correctIndex: 1
    },
    {
      id: 10,
      question: "What does REPL stand for in Node.js?",
      options: ["Read Eval Print Loop", "Run Execute Process List", "Realtime Event Processing Library", "Request Event Packet Loop"],
      correctIndex: 0
    }
  ],
  MongoDB: [
    {
      id: 1,
      question: "What format does MongoDB use to store data documents?",
      options: ["XML", "JSON", "BSON", "SQL"],
      correctIndex: 2
    },
    {
      id: 2,
      question: "Which command is used to insert a document into a MongoDB collection?",
      options: ["insert()", "insertOne() / insertMany()", "add()", "push()"],
      correctIndex: 1
    },
    {
      id: 3,
      question: "What is a primary key equivalent in MongoDB documents?",
      options: ["_id", "primaryKey", "uid", "indexKey"],
      correctIndex: 0
    },
    {
      id: 4,
      question: "How do you create an index in MongoDB?",
      options: ["createIndex()", "addIndex()", "ensureIndex()", "index()"],
      correctIndex: 0
    },
    {
      id: 5,
      question: "Which operator is used to filter fields that match exactly one value in a list?",
      options: ["$or", "$in", "$and", "$eq"],
      correctIndex: 1
    },
    {
      id: 6,
      question: "What is the purpose of the aggregation framework in MongoDB?",
      options: ["To perform join index actions", "To process and transform data documents into computed summaries", "To back up collections", "To create unique compound keys"],
      correctIndex: 1
    },
    {
      id: 7,
      question: "How do you perform a projection in MongoDB queries?",
      options: ["By using projection() method", "By passing a field specification document as the second argument to find()", "By using findProjection()", "By using query constraints"],
      correctIndex: 1
    },
    {
      id: 8,
      question: "What is Mongoose in relation to MongoDB?",
      options: ["A MongoDB graphical shell UI", "An ODM (Object Data Modeling) library for Node.js", "A MongoDB hosting cloud", "A database engine backup utility"],
      correctIndex: 1
    },
    {
      id: 9,
      question: "Which operator is used to increment a numeric value in a document field?",
      options: ["$add", "$inc", "$sum", "$set"],
      correctIndex: 1
    },
    {
      id: 10,
      question: "What type of database structure is MongoDB classified as?",
      options: ["Relational Database", "Document-oriented NoSQL Database", "Key-Value Cache Database", "Graph Database"],
      correctIndex: 1
    }
  ],
  Express: [
    {
      id: 1,
      question: "What is Express.js in relation to Node.js?",
      options: ["A separate database engine", "A fast, minimalist web application framework", "A JavaScript compiler", "A cloud deployment system"],
      correctIndex: 1
    },
    {
      id: 2,
      question: "What is middleware in Express?",
      options: ["A database layer", "A function that has access to request, response objects, and next middleware", "An HTML engine", "A routing module"],
      correctIndex: 1
    },
    {
      id: 3,
      question: "How do you define a route parameter in Express routes?",
      options: ["/users/{id}", "/users/:id", "/users/id", "/users?id"],
      correctIndex: 1
    },
    {
      id: 4,
      question: "Which method is used to parse JSON body payloads in Express 4.x?",
      options: ["express.json()", "bodyParser()", "req.parseJson()", "res.json()"],
      correctIndex: 0
    },
    {
      id: 5,
      question: "How do you send a JSON response to a client from Express controllers?",
      options: ["res.write(json)", "res.sendJson(data)", "res.json(data)", "res.end(data)"],
      correctIndex: 2
    },
    {
      id: 6,
      question: "What is the purpose of the 'next()' function in Express middleware?",
      options: ["To complete the request", "To pass control to the next matching middleware function", "To redirect to a page", "To throw an exception error"],
      correctIndex: 1
    },
    {
      id: 7,
      question: "Which Express method is used to listen to HTTP POST requests?",
      options: ["app.get()", "app.post()", "app.put()", "app.delete()"],
      correctIndex: 1
    },
    {
      id: 8,
      question: "How do you handle central errors in Express?",
      options: ["By defining error-handling middleware with 4 arguments (err, req, res, next)", "Using try-catch blocks in server.js entry point only", "Express handles all errors automatically without crash", "Using throw new Error() without catch"],
      correctIndex: 0
    },
    {
      id: 9,
      question: "How do you mount static files directory in Express?",
      options: ["app.mount()", "app.use(express.static('public'))", "app.staticFile('public')", "app.get('/static')"],
      correctIndex: 1
    },
    {
      id: 10,
      question: "Which object handles incoming query string parameters in Express routes?",
      options: ["req.body", "req.params", "req.query", "req.headers"],
      correctIndex: 2
    }
  ],
  JavaScript: [
    {
      id: 1,
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      options: ["String", "Number", "Array", "Boolean"],
      correctIndex: 2
    },
    {
      id: 2,
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: ["They are identical", "=== compares both value and type, while == performs type coercion", "== is faster than ===", "=== is only used for object instances"],
      correctIndex: 1
    },
    {
      id: 3,
      question: "What is a Closure in JavaScript?",
      options: ["An object constructor", "A function bundled with references to its surrounding state", "A browser compilation loop", "A method to delete variables"],
      correctIndex: 1
    },
    {
      id: 4,
      question: "How do you write a single line comment in JavaScript?",
      options: ["/* comment */", "// comment", "# comment", "<!-- comment -->"],
      correctIndex: 1
    },
    {
      id: 5,
      question: "What does 'this' keyword represent inside a standard object method?",
      options: ["The global window object", "The calling function namespace", "The object instance executing the method", "The browser document object"],
      correctIndex: 2
    },
    {
      id: 6,
      question: "Which array method returns a new array with all elements that pass a test?",
      options: ["map()", "filter()", "find()", "forEach()"],
      correctIndex: 1
    },
    {
      id: 7,
      question: "What is the purpose of Promises in JavaScript?",
      options: ["To represent sync executions", "To handle asynchronous operations outcomes", "To store session values", "To create function closures"],
      correctIndex: 1
    },
    {
      id: 8,
      question: "How do you convert a JSON string into a JavaScript object?",
      options: ["JSON.stringify()", "JSON.parse()", "Object.parse()", "req.body"],
      correctIndex: 1
    },
    {
      id: 9,
      question: "Which declaration keyword has block scope in ES6?",
      options: ["var", "let", "function", "global"],
      correctIndex: 1
    },
    {
      id: 10,
      question: "Which method clears a timer set with setTimeout()?",
      options: ["clearTimeout()", "stopTimeout()", "resetTimer()", "deleteTimer()"],
      correctIndex: 0
    }
  ]
};
