const JOB_SKILLS = {
  "Data Analyst": {
    technical: [
      "Python", "R", "SQL", "Excel", "Power BI", "Tableau",
      "Pandas", "NumPy", "Matplotlib", "Seaborn", "Statistics",
      "Data Mining", "ETL", "A/B Testing", "Google Analytics",
      "MySQL", "PostgreSQL", "MongoDB", "Scala", "Apache Spark",
      "Looker", "SPSS", "SAS", "JavaScript", "DAX"
    ],
    soft: [
      "Communication", "Problem Solving", "Attention to Detail",
      "Data Visualization", "Business Acumen", "Critical Thinking"
    ],
    description: "Analyze data, create visualizations, and provide business insights"
  },
  "Web Developer": {
    technical: [
      "HTML", "CSS", "JavaScript", "React", "Vue", "Angular",
      "Node.js", "Express", "PHP", "Django", "Flask", "Java",
      "C#", "TypeScript", "Git", "SQL", "MongoDB", "MySQL",
      "PostgreSQL", "REST API", "GraphQL", "Docker", "AWS",
      "Google Cloud", "Firebase", "webpack", "npm", "Sass",
      "Bootstrap", "Material UI", "Linux", "Agile"
    ],
    soft: [
      "Communication", "Teamwork", "Problem Solving", "Creativity",
      "Time Management", "Attention to Detail"
    ],
    description: "Build and maintain web applications using modern frameworks and technologies"
  },
  "ML Engineer": {
    technical: [
      "Python", "Machine Learning", "Deep Learning", "TensorFlow",
      "PyTorch", "Keras", "scikit-learn", "Natural Language Processing",
      "Computer Vision", "Neural Networks", "Pandas", "NumPy",
      "Matplotlib", "Jupyter", "SQL", "Spark", "Hadoop", "AWS",
      "Google Cloud", "Docker", "Git", "Linux", "Statistics",
      "Linear Algebra", "Calculus", "R", "Scala", "Reinforcement Learning",
      "CNN", "RNN", "LSTM", "Transformers", "MLOps", "Kubernetes"
    ],
    soft: [
      "Problem Solving", "Communication", "Research", "Attention to Detail",
      "Teamwork", "Creativity"
    ],
    description: "Develop machine learning models and deploy AI solutions"
  }
};

const JOB_DESCRIPTIONS = {
  "Data Analyst": `Data Analyst role focused on collecting, cleaning, and analyzing structured and unstructured data to support business decisions. Responsibilities include SQL querying, dashboard building, reporting, trend analysis, and data visualization with tools like Tableau or Power BI. Strong skills in Python, Excel, statistics, ETL, and communication are expected.`,
  "Web Developer": `Web Developer role focused on building responsive, performant web applications. Responsibilities include frontend and backend development, API integration, debugging, testing, and deployment. Strong knowledge of HTML, CSS, JavaScript, React, Node.js, databases, Git, and cloud deployment is preferred.`,
  "ML Engineer": `Machine Learning Engineer role focused on building and deploying ML systems. Responsibilities include data preprocessing, model development, evaluation, optimization, and productionization. Strong skills in Python, TensorFlow or PyTorch, statistics, feature engineering, MLOps, Docker, and cloud services are expected.`
};

const LEARNING_RESOURCES = {
  // Programming Languages
  Python: {
    courses: [
      "https://www.youtube.com/watch?v=rfscVS0vtbw - Python Full Course for Beginners",
      "Complete Python Bootcamp (Udemy)",
      "Python for Everybody (Coursera)"
    ],
    websites: ["python.org", "realpython.com", "w3schools.com/python"],
    duration: "4-6 weeks"
  },
  JavaScript: {
    courses: [
      "https://www.youtube.com/watch?v=PkZNo7MFNFg - JavaScript Full Course",
      "The Complete JavaScript Course (Udemy)",
      "JavaScript Algorithms (freeCodeCamp)"
    ],
    websites: ["developer.mozilla.org", "javascript.info"],
    duration: "4-6 weeks"
  },
  TypeScript: {
    courses: [
      "https://www.youtube.com/watch?v=BwuLxPH8IDs - TypeScript Crash Course",
      "Understanding TypeScript (Udemy)",
      "TypeScript Fundamentals (Pluralsight)"
    ],
    websites: ["typescriptlang.org", "typescriptlang.org/docs"],
    duration: "3-4 weeks"
  },
  Java: {
    courses: [
      "https://www.youtube.com/watch?v=eIrMbAQSU34 - Java Full Course",
      "Java Programming Masterclass (Udemy)",
      "Object Oriented Programming in Java (Coursera)"
    ],
    websites: ["docs.oracle.com/javase", "java.com"],
    duration: "6-8 weeks"
  },
  "C#": {
    courses: [
      "https://www.youtube.com/watch?v=GhQdlIFylQ8 - C# Full Course",
      "C# Basics for Beginners (Udemy)",
      "C# Programming (Microsoft Learn)"
    ],
    websites: ["docs.microsoft.com/dotnet/csharp", "learn.microsoft.com"],
    duration: "5-7 weeks"
  },
  PHP: {
    courses: [
      "https://www.youtube.com/watch?v=OK_JCtrrv-c - PHP Full Course",
      "PHP for Beginners (Udemy)",
      "PHP Fundamentals (Codecademy)"
    ],
    websites: ["php.net", "php.net/manual"],
    duration: "4-5 weeks"
  },
  R: {
    courses: [
      "https://www.youtube.com/watch?v=_V8eKsto3Ug - R Programming Full Course",
      "R Programming A-Z (Udemy)",
      "R Programming (DataCamp)"
    ],
    websites: ["r-project.org", "rstudio.com"],
    duration: "4-6 weeks"
  },
  Scala: {
    courses: [
      "https://www.youtube.com/watch?v=-8V6bMjThNo - Scala Tutorial",
      "Scala & Functional Programming (Udemy)",
      "Functional Programming in Scala (Coursera)"
    ],
    websites: ["scala-lang.org", "docs.scala-lang.org"],
    duration: "5-6 weeks"
  },

  // Frontend Frameworks & Libraries
  React: {
    courses: [
      "https://www.youtube.com/watch?v=b9eMGE7QtTk - React JS Full Course",
      "React - The Complete Guide (Udemy)",
      "React for Beginners (Scrimba)"
    ],
    websites: ["react.dev", "reactjs.org"],
    duration: "4-6 weeks"
  },
  Vue: {
    courses: [
      "https://www.youtube.com/watch?v=FXpIoQ_rT_c - Vue JS Crash Course",
      "Vue 3 Complete Guide (Udemy)",
      "Vue.js Fundamentals (Pluralsight)"
    ],
    websites: ["vuejs.org", "vuejs.org/guide"],
    duration: "3-5 weeks"
  },
  Angular: {
    courses: [
      "https://www.youtube.com/watch?v=3qBXWUpoPHo - Angular Full Course",
      "Angular - The Complete Guide (Udemy)",
      "Angular Fundamentals (Pluralsight)"
    ],
    websites: ["angular.io", "angular.io/docs"],
    duration: "5-7 weeks"
  },
  HTML: {
    courses: [
      "https://www.youtube.com/watch?v=pQN-pnXPaVg - HTML Full Course",
      "HTML5 Basics (Udemy)",
      "HTML & CSS (Codecademy)"
    ],
    websites: ["mdn.mozilla.org/html", "html.spec.whatwg.org"],
    duration: "1-2 weeks"
  },
  CSS: {
    courses: [
      "https://www.youtube.com/watch?v=1Rs2ND1ryYc - CSS Full Course",
      "CSS3 Masterclass (Udemy)",
      "Advanced CSS (Codecademy)"
    ],
    websites: ["css-tricks.com", "mdn.mozilla.org/css"],
    duration: "2-3 weeks"
  },
  Sass: {
    courses: [
      "https://www.youtube.com/watch?v=_a5j7KoflTs - Sass Tutorial",
      "Advanced CSS with Sass (Udemy)",
      "Sass & SCSS Complete Course"
    ],
    websites: ["sass-lang.com", "sass-lang.com/documentation"],
    duration: "2-3 weeks"
  },
  Bootstrap: {
    courses: [
      "https://www.youtube.com/watch?v=4sosXZsdy-s - Bootstrap 5 Tutorial",
      "Bootstrap 5 From Scratch (Udemy)",
      "Bootstrap Framework (freeCodeCamp)"
    ],
    websites: ["getbootstrap.com", "getbootstrap.com/docs"],
    duration: "2-3 weeks"
  },
  "Material UI": {
    courses: [
      "https://www.youtube.com/watch?v=vyJU9efvUtQ - Material UI Tutorial",
      "Material UI Complete Guide (Udemy)",
      "Material Design with React"
    ],
    websites: ["mui.com", "material.io/design"],
    duration: "2-3 weeks"
  },

  // Backend & Server
  "Node.js": {
    courses: [
      "https://www.youtube.com/watch?v=Oe421EPjeBE - Node.js Full Course",
      "Node.js - The Complete Guide (Udemy)",
      "Node.js Basics (Coursera)"
    ],
    websites: ["nodejs.org", "expressjs.com"],
    duration: "4-6 weeks"
  },
  Express: {
    courses: [
      "https://www.youtube.com/watch?v=L72fhGm1tfE - Express JS Crash Course",
      "Node.js & Express.js (Udemy)",
      "Express Framework Tutorial"
    ],
    websites: ["expressjs.com", "expressjs.com/guide"],
    duration: "2-3 weeks"
  },
  Django: {
    courses: [
      "https://www.youtube.com/watch?v=o0XbHvKxw7Y - Django Full Course",
      "Django for Beginners (Udemy)",
      "Python Django Tutorial (Coursera)"
    ],
    websites: ["djangoproject.com", "docs.djangoproject.com"],
    duration: "5-7 weeks"
  },
  Flask: {
    courses: [
      "https://www.youtube.com/watch?v=Z1RJmh_OqeA - Flask Tutorial",
      "Flask Web Development (Udemy)",
      "REST APIs with Flask (Coursera)"
    ],
    websites: ["flask.palletsprojects.com", "flask.palletsprojects.com/tutorial"],
    duration: "3-4 weeks"
  },

  // Databases
  SQL: {
    courses: [
      "https://www.youtube.com/watch?v=HXV3zeQKqGY - SQL Full Course",
      "The Complete SQL Bootcamp (Udemy)",
      "SQL for Data Analysis (Udacity)"
    ],
    websites: ["sqlzoo.net", "mode.com/sql-tutorial"],
    duration: "3-4 weeks"
  },
  MySQL: {
    courses: [
      "https://www.youtube.com/watch?v=7S_tz1z_5bA - MySQL Tutorial",
      "MySQL Bootcamp (Udemy)",
      "MySQL Fundamentals (Pluralsight)"
    ],
    websites: ["mysql.com", "dev.mysql.com/doc"],
    duration: "3-4 weeks"
  },
  PostgreSQL: {
    courses: [
      "https://www.youtube.com/watch?v=qw--VYLpxG4 - PostgreSQL Tutorial",
      "PostgreSQL Bootcamp (Udemy)",
      "PostgreSQL for Developers (Coursera)"
    ],
    websites: ["postgresql.org", "postgresqltutorial.com"],
    duration: "3-4 weeks"
  },
  MongoDB: {
    courses: [
      "https://www.youtube.com/watch?v=ExcRbA7fy_A - MongoDB Crash Course",
      "MongoDB Complete Developer Guide (Udemy)",
      "MongoDB Basics (MongoDB University)"
    ],
    websites: ["mongodb.com", "docs.mongodb.com"],
    duration: "3-4 weeks"
  },
  Firebase: {
    courses: [
      "https://www.youtube.com/watch?v=9kRgVxULbag - Firebase Tutorial",
      "Firebase Complete Guide (Udemy)",
      "Firebase Fundamentals (Google)"
    ],
    websites: ["firebase.google.com", "firebase.google.com/docs"],
    duration: "2-3 weeks"
  },

  // Data Science & ML
  Pandas: {
    courses: [
      "https://www.youtube.com/watch?v=vmEHCJofslg - Pandas Full Course",
      "Data Analysis with Pandas (Udemy)",
      "Pandas for Data Science (DataCamp)"
    ],
    websites: ["pandas.pydata.org", "pandas.pydata.org/docs"],
    duration: "2-3 weeks"
  },
  NumPy: {
    courses: [
      "https://www.youtube.com/watch?v=QUT1VHiLmmI - NumPy Tutorial",
      "NumPy Complete Course (Udemy)",
      "NumPy Basics (DataCamp)"
    ],
    websites: ["numpy.org", "numpy.org/doc"],
    duration: "2-3 weeks"
  },
  Matplotlib: {
    courses: [
      "https://www.youtube.com/watch?v=OZOOLe8imSo - Matplotlib Tutorial",
      "Data Visualization with Matplotlib (Udemy)",
      "Matplotlib Fundamentals (DataCamp)"
    ],
    websites: ["matplotlib.org", "matplotlib.org/stable"],
    duration: "2-3 weeks"
  },
  Seaborn: {
    courses: [
      "https://www.youtube.com/watch?v=6GUZXDef2U0 - Seaborn Tutorial",
      "Data Visualization with Seaborn (Udemy)",
      "Seaborn for Data Science"
    ],
    websites: ["seaborn.pydata.org", "seaborn.pydata.org/tutorial"],
    duration: "2-3 weeks"
  },
  "Machine Learning": {
    courses: [
      "https://www.youtube.com/watch?v=7eh4d6sabA0 - Machine Learning Full Course",
      "Machine Learning A-Z (Udemy)",
      "Machine Learning Specialization (Coursera)"
    ],
    websites: ["scikit-learn.org", "tensorflow.org"],
    duration: "8-12 weeks"
  },
  TensorFlow: {
    courses: [
      "https://www.youtube.com/watch?v=tPYj3fFJGjk - TensorFlow Full Course",
      "TensorFlow Developer Certificate (Udemy)",
      "Deep Learning with TensorFlow (Coursera)"
    ],
    websites: ["tensorflow.org", "tensorflow.org/learn"],
    duration: "5-7 weeks"
  },
  PyTorch: {
    courses: [
      "https://www.youtube.com/watch?v=c36lUUr864M - PyTorch Full Course",
      "PyTorch for Deep Learning (Udemy)",
      "Deep Learning with PyTorch (Coursera)"
    ],
    websites: ["pytorch.org", "pytorch.org/tutorials"],
    duration: "5-7 weeks"
  },
  Keras: {
    courses: [
      "https://www.youtube.com/watch?v=qFJeN9V1ZsI - Keras Tutorial",
      "Keras Deep Learning (Udemy)",
      "Deep Learning with Keras (Coursera)"
    ],
    websites: ["keras.io", "keras.io/guides"],
    duration: "3-4 weeks"
  },
  "scikit-learn": {
    courses: [
      "https://www.youtube.com/watch?v=pqNCD_5r0IU - Scikit-Learn Full Course",
      "Machine Learning with scikit-learn (Udemy)",
      "scikit-learn for Data Science"
    ],
    websites: ["scikit-learn.org", "scikit-learn.org/stable"],
    duration: "4-5 weeks"
  },
  "Deep Learning": {
    courses: [
      "https://www.youtube.com/watch?v=aircAruvnKk - Deep Learning Explained",
      "Deep Learning Specialization (Coursera)",
      "Deep Learning A-Z (Udemy)"
    ],
    websites: ["deeplearningbook.org", "fast.ai"],
    duration: "8-12 weeks"
  },
  "Computer Vision": {
    courses: [
      "https://www.youtube.com/watch?v=oXlwWbU8l2o - Computer Vision Tutorial",
      "Computer Vision Bootcamp (Udemy)",
      "Computer Vision Specialization (Coursera)"
    ],
    websites: ["opencv.org", "pyimagesearch.com"],
    duration: "6-8 weeks"
  },
  "Natural Language Processing": {
    courses: [
      "https://www.youtube.com/watch?v=fLvJ8VdHLA0 - NLP Full Course",
      "NLP - Natural Language Processing (Udemy)",
      "NLP Specialization (Coursera)"
    ],
    websites: ["nlp.stanford.edu", "huggingface.co"],
    duration: "6-8 weeks"
  },

  // DevOps & Cloud
  Docker: {
    courses: [
      "https://www.youtube.com/watch?v=3c-iBn73dDE - Docker Tutorial",
      "Docker & Kubernetes Complete Guide (Udemy)",
      "Docker Mastery (Udemy)"
    ],
    websites: ["docker.com", "docs.docker.com"],
    duration: "3-4 weeks"
  },
  Kubernetes: {
    courses: [
      "https://www.youtube.com/watch?v=X48VuDVv0do - Kubernetes Full Course",
      "Kubernetes for Absolute Beginners (Udemy)",
      "Kubernetes Fundamentals (Pluralsight)"
    ],
    websites: ["kubernetes.io", "kubernetes.io/docs"],
    duration: "4-6 weeks"
  },
  AWS: {
    courses: [
      "https://www.youtube.com/watch?v=SOTamWNgDKc - AWS Full Course",
      "AWS Certified Solutions Architect (Udemy)",
      "AWS Fundamentals (Coursera)"
    ],
    websites: ["aws.amazon.com", "aws.amazon.com/getting-started"],
    duration: "6-8 weeks"
  },
  "Google Cloud": {
    courses: [
      "https://www.youtube.com/watch?v=4D3X6Xl5c_Y - Google Cloud Tutorial",
      "Google Cloud Platform (Udemy)",
      "GCP Fundamentals (Coursera)"
    ],
    websites: ["cloud.google.com", "cloud.google.com/docs"],
    duration: "5-7 weeks"
  },
  Linux: {
    courses: [
      "https://www.youtube.com/watch?v=sWbUDq4S6Y8 - Linux Full Course",
      "Linux Command Line Basics (Udemy)",
      "Linux Fundamentals (Pluralsight)"
    ],
    websites: ["linux.com", "linuxcommand.org"],
    duration: "3-4 weeks"
  },
  Git: {
    courses: [
      "https://www.youtube.com/watch?v=RGOj5yH7evk - Git & GitHub Full Course",
      "Git Complete Guide (Udemy)",
      "Version Control with Git (Coursera)"
    ],
    websites: ["git-scm.com", "github.com/git-guides"],
    duration: "1-2 weeks"
  },

  // Data Tools & Analytics
  Excel: {
    courses: [
      "https://www.youtube.com/watch?v=Vl0H-qTclOg - Excel Full Course",
      "Microsoft Excel - Data Analysis (Udemy)",
      "Excel Skills for Business (Coursera)"
    ],
    websites: ["support.microsoft.com/excel", "excel.tips"],
    duration: "2-3 weeks"
  },
  Tableau: {
    courses: [
      "https://www.youtube.com/watch?v=aHaOIvR00So - Tableau Full Course",
      "Tableau Desktop Specialist (Udemy)",
      "Data Visualization with Tableau (Coursera)"
    ],
    websites: ["tableau.com/learn", "help.tableau.com"],
    duration: "4-6 weeks"
  },
  "Power BI": {
    courses: [
      "https://www.youtube.com/watch?v=TmhQCQr_DCA - Power BI Full Course",
      "Microsoft Power BI Desktop (Udemy)",
      "Power BI Fundamentals (Microsoft Learn)"
    ],
    websites: ["powerbi.microsoft.com", "docs.microsoft.com/power-bi"],
    duration: "3-5 weeks"
  },
  Spark: {
    courses: [
      "https://www.youtube.com/watch?v=S2MUhGA3lEw - Apache Spark Tutorial",
      "Apache Spark with Python (Udemy)",
      "Big Data with Spark (Coursera)"
    ],
    websites: ["spark.apache.org", "spark.apache.org/docs"],
    duration: "5-6 weeks"
  },
  Hadoop: {
    courses: [
      "https://www.youtube.com/watch?v=1vbXmCrkT3Y - Hadoop Tutorial",
      "Hadoop Big Data Bootcamp (Udemy)",
      "Hadoop Platform (Coursera)"
    ],
    websites: ["hadoop.apache.org", "hadoop.apache.org/docs"],
    duration: "5-6 weeks"
  },
  "Google Analytics": {
    courses: [
      "https://www.youtube.com/watch?v=gBeMELnxdmQ - Google Analytics Tutorial",
      "Google Analytics Certification (Google)",
      "Google Analytics Masterclass (Udemy)"
    ],
    websites: ["analytics.google.com", "support.google.com/analytics"],
    duration: "2-3 weeks"
  },

  // Tools & Build Systems
  webpack: {
    courses: [
      "https://www.youtube.com/watch?v=MpGLUVbqoYQ - Webpack Tutorial",
      "Webpack Course Complete Guide (Udemy)",
      "Module Bundling with Webpack"
    ],
    websites: ["webpack.js.org", "webpack.js.org/concepts"],
    duration: "2-3 weeks"
  },
  npm: {
    courses: [
      "https://www.youtube.com/watch?v=P3aKRdUyr0s - npm Crash Course",
      "npm Package Management (Udemy)",
      "Node Package Manager Basics"
    ],
    websites: ["npmjs.com", "docs.npmjs.com"],
    duration: "1-2 weeks"
  },

  // APIs & Architecture
  "REST API": {
    courses: [
      "https://www.youtube.com/watch?v=-MTSQjw5DrM - REST API Tutorial",
      "REST API Design Best Practices (Udemy)",
      "Building RESTful APIs (Coursera)"
    ],
    websites: ["restfulapi.net", "swagger.io"],
    duration: "2-3 weeks"
  },
  GraphQL: {
    courses: [
      "https://www.youtube.com/watch?v=ed8SzALpx1Q - GraphQL Full Course",
      "GraphQL Complete Guide (Udemy)",
      "Modern GraphQL Bootcamp"
    ],
    websites: ["graphql.org", "graphql.org/learn"],
    duration: "3-4 weeks"
  },

  // Soft Skills
  Communication: {
    courses: [
      "https://www.youtube.com/watch?v=RQEhMCEgvVU - Effective Communication Skills",
      "Communication Skills (Coursera)",
      "Business Communication (LinkedIn Learning)"
    ],
    websites: ["toastmasters.org", "coursera.org"],
    duration: "4-6 weeks"
  },
  "Problem Solving": {
    courses: [
      "https://www.youtube.com/watch?v=UFc-RPbq8kg - Problem Solving Techniques",
      "Critical Thinking & Problem Solving (Udemy)",
      "Problem Solving Skills (Coursera)"
    ],
    websites: ["coursera.org", "linkedin.com/learning"],
    duration: "3-4 weeks"
  },
  Teamwork: {
    courses: [
      "https://www.youtube.com/watch?v=BzMLA8YIgG0 - Teamwork Skills",
      "Teamwork & Collaboration (Coursera)",
      "Effective Team Collaboration (LinkedIn Learning)"
    ],
    websites: ["linkedin.com/learning", "coursera.org"],
    duration: "2-3 weeks"
  },
  "Attention to Detail": {
    courses: [
      "https://www.youtube.com/watch?v=dRl5LJJWneI - Attention to Detail Skills",
      "Quality Assurance Training (Udemy)",
      "Precision and Excellence (LinkedIn Learning)"
    ],
    websites: ["linkedin.com/learning", "udemy.com"],
    duration: "1-2 weeks"
  },
  Creativity: {
    courses: [
      "https://www.youtube.com/watch?v=cLSZXMGwBHU - Creative Thinking",
      "Creative Problem Solving (Coursera)",
      "Innovation & Creativity (Udemy)"
    ],
    websites: ["coursera.org", "linkedin.com/learning"],
    duration: "3-4 weeks"
  },
  "Time Management": {
    courses: [
      "https://www.youtube.com/watch?v=iONDebHX9qk - Time Management Skills",
      "Time Management Mastery (Udemy)",
      "Work Smarter, Not Harder (Coursera)"
    ],
    websites: ["linkedin.com/learning", "coursera.org"],
    duration: "2-3 weeks"
  },
  "Critical Thinking": {
    courses: [
      "https://www.youtube.com/watch?v=Cum3k-Wglfw - Critical Thinking Skills",
      "Critical Thinking Course (Udemy)",
      "Logic and Reasoning (Coursera)"
    ],
    websites: ["linkedin.com/learning", "coursera.org"],
    duration: "3-4 weeks"
  },
  "Business Acumen": {
    courses: [
      "https://www.youtube.com/watch?v=9e2cZmffPGE - Business Fundamentals",
      "Business Acumen (Coursera)",
      "Business Strategy Essentials (LinkedIn Learning)"
    ],
    websites: ["linkedin.com/learning", "businessnewsdaily.com"],
    duration: "4-6 weeks"
  },

  // Statistics & Math
  Statistics: {
    courses: [
      "https://www.youtube.com/watch?v=xxpc-HPKN28 - Statistics Full Course",
      "Statistics for Data Science (Udemy)",
      "Statistics with Python (Coursera)"
    ],
    websites: ["khanacademy.org/math/statistics", "coursera.org"],
    duration: "6-8 weeks"
  },
  "Linear Algebra": {
    courses: [
      "https://www.youtube.com/watch?v=JnTa9XtvmfI - Linear Algebra Full Course",
      "Linear Algebra Essentials (Udemy)",
      "Mathematics for Machine Learning (Coursera)"
    ],
    websites: ["khanacademy.org/math/linear-algebra", "3blue1brown.com"],
    duration: "4-5 weeks"
  },
  Calculus: {
    courses: [
      "https://www.youtube.com/watch?v=WUvTyaaNkzM - Calculus 1 Full Course",
      "Calculus Complete Course (Udemy)",
      "Calculus Applied (Coursera)"
    ],
    websites: ["khanacademy.org/math/calculus", "mathsisfun.com"],
    duration: "6-8 weeks"
  },

  // Additional Technologies
  Jupyter: {
    courses: [
      "https://www.youtube.com/watch?v=HW29067qVWk - Jupyter Notebook Tutorial",
      "Jupyter for Data Science (Udemy)",
      "Notebooks and Data Science"
    ],
    websites: ["jupyter.org", "jupyter-notebook.readthedocs.io"],
    duration: "1-2 weeks"
  },
  Agile: {
    courses: [
      "https://www.youtube.com/watch?v=502ILHjX9EE - Agile Methodology",
      "Agile Fundamentals (Coursera)",
      "Scrum Master Certification (Udemy)"
    ],
    websites: ["agilemanifesto.org", "scrum.org"],
    duration: "3-4 weeks"
  },
  "Data Visualization": {
    courses: [
      "https://www.youtube.com/watch?v=hEPHw79RcsE - Data Visualization Tutorial",
      "Data Visualization Fundamentals (Coursera)",
      "Visual Analytics with D3.js (Udemy)"
    ],
    websites: ["d3js.org", "observable.com"],
    duration: "4-5 weeks"
  },
  "Data Mining": {
    courses: [
      "https://www.youtube.com/watch?v=VaomY9DEgfY - Data Mining Full Course",
      "Data Mining with Python (Udemy)",
      "Data Mining Fundamentals (Coursera)"
    ],
    websites: ["kdnuggets.com", "coursera.org"],
    duration: "5-6 weeks"
  },
  ETL: {
    courses: [
      "https://www.youtube.com/watch?v=C-BNcknLIRs - ETL Process Tutorial",
      "ETL Fundamentals (Udemy)",
      "Data Integration (Coursera)"
    ],
    websites: ["talend.com/resources", "informatica.com"],
    duration: "4-5 weeks"
  },
  "A/B Testing": {
    courses: [
      "https://www.youtube.com/watch?v=DEwBhWX_nPs - A/B Testing Tutorial",
      "A/B Testing Course (Udacity)",
      "Experimentation at Scale (Coursera)"
    ],
    websites: ["optimizely.com/resources", "vwo.com/resources"],
    duration: "2-3 weeks"
  },
  Looker: {
    courses: [
      "https://www.youtube.com/watch?v=KEXAGzFODzk - Looker Tutorial",
      "Looker Analytics (Udemy)",
      "Business Intelligence with Looker"
    ],
    websites: ["cloud.google.com/looker", "looker.com"],
    duration: "3-4 weeks"
  },
  SPSS: {
    courses: [
      "https://www.youtube.com/watch?v=TQQaRSvPxd4 - SPSS Tutorial",
      "SPSS Statistics Complete Course (Udemy)",
      "IBM SPSS Training (IBM)"
    ],
    websites: ["ibm.com/spss", "ibm.com/support/spss"],
    duration: "3-4 weeks"
  },
  SAS: {
    courses: [
      "https://www.youtube.com/watch?v=dPCQkU7ZP0E - SAS Programming Tutorial",
      "SAS Programming Complete Guide (Udemy)",
      "SAS Fundamentals (Coursera)"
    ],
    websites: ["sas.com", "support.sas.com"],
    duration: "4-5 weeks"
  },
  DAX: {
    courses: [
      "https://www.youtube.com/watch?v=iEHPjILmZfg - DAX Formula Tutorial",
      "DAX for Power BI (Udemy)",
      "Data Modeling with DAX"
    ],
    websites: ["dax.guide", "sqlbi.com"],
    duration: "3-4 weeks"
  },
  MLOps: {
    courses: [
      "https://www.youtube.com/watch?v=yuHh-PjS8fY - MLOps Tutorial",
      "MLOps Complete Guide (Udemy)",
      "Machine Learning Engineering (Coursera)"
    ],
    websites: ["ml-ops.org", "cloud.google.com/mlops"],
    duration: "5-6 weeks"
  },
  Research: {
    courses: [
      "https://www.youtube.com/watch?v=RXNN0ZiQbPk - Research Methods",
      "Research Methodology (Coursera)",
      "Academic Research Skills (Udemy)"
    ],
    websites: ["researchgate.net", "scholar.google.com"],
    duration: "4-6 weeks"
  }
};

const SKILL_QUESTIONS = {
  Python: [
    { question: "What keyword is used to create a function in Python?", options: ["def", "function", "func", "define"], correct: 0 },
    { question: "Which of these is a mutable data type in Python?", options: ["tuple", "string", "list", "frozenset"], correct: 2 },
    { question: "What does len() function do?", options: ["Returns the length of an object", "Deletes an object", "Creates a new object", "Converts to integer"], correct: 0 }
  ],
  SQL: [
    { question: "Which SQL keyword is used to retrieve data?", options: ["GET", "SELECT", "FETCH", "RETRIEVE"], correct: 1 },
    { question: "What does JOIN do in SQL?", options: ["Combines rows from two or more tables", "Adds new rows", "Deletes rows", "Updates values"], correct: 0 },
    { question: "Which clause filters records after grouping?", options: ["WHERE", "HAVING", "FILTER", "GROUP"], correct: 1 }
  ],
  JavaScript: [
    { question: "What is the correct way to declare a variable in JavaScript?", options: ["var x = 5;", "variable x = 5;", "x := 5;", "declare x = 5;"], correct: 0 },
    { question: "What does typeof operator return for an array?", options: ["array", "object", "list", "Array"], correct: 1 },
    { question: "Which method adds an element to the end of an array?", options: ["add()", "push()", "append()", "insert()"], correct: 1 }
  ],
  React: [
    { question: "What is a React component?", options: ["A CSS class", "A reusable piece of UI", "A JavaScript function", "Both B and C"], correct: 3 },
    { question: "What hook is used to manage state in functional components?", options: ["useEffect", "useState", "useContext", "useReducer"], correct: 1 },
    { question: "What is the virtual DOM in React?", options: ["A physical DOM in the browser", "A JavaScript representation of the UI", "A server-side DOM", "A CSS framework"], correct: 1 }
  ],
  Git: [
    { question: "What command creates a new Git repository?", options: ["git create", "git init", "git new", "git setup"], correct: 1 },
    { question: "Which command saves changes to the repository?", options: ["git save", "git store", "git commit", "git push"], correct: 2 },
    { question: "What does git pull do?", options: ["Uploads changes", "Fetches and merges remote changes", "Deletes files", "Creates a branch"], correct: 1 }
  ],
  Excel: [
    { question: "What symbol is used to start a formula in Excel?", options: [":", "#", "=", "@"], correct: 2 },
    { question: "Which function calculates the average of cells?", options: ["AVG()", "MEAN()", "AVERAGE()", "SUM()"], correct: 2 },
    { question: "What is a pivot table used for?", options: ["Creating formulas", "Summarizing and analyzing data", "Drawing charts", "Formatting cells"], correct: 1 }
  ],
  HTML: [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"], correct: 0 },
    { question: "Which tag is used for the largest heading?", options: ["<h6>", "<h1>", "<h9>", "<heading>"], correct: 1 },
    { question: "What attribute specifies the URL of a link?", options: ["url", "link", "href", "src"], correct: 2 }
  ],
  CSS: [
    { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], correct: 1 },
    { question: "Which property changes text color?", options: ["text-color", "color", "font-color", "text-style"], correct: 1 },
    { question: "What is the default display value for div elements?", options: ["inline", "block", "flex", "grid"], correct: 1 }
  ],
  Pandas: [
    { question: "What is a Pandas DataFrame?", options: ["A series of numbers", "A 2D tabular data structure", "A Python dictionary", "A list of lists"], correct: 1 },
    { question: "How do you read a CSV file using Pandas?", options: ["pd.read_file()", "pd.read_csv()", "pd.load_csv()", "pd.open_csv()"], correct: 1 },
    { question: "What does dropna() do in Pandas?", options: ["Drops columns", "Removes null/NaN values", "Drops rows", "Deletes the dataframe"], correct: 1 }
  ],
  NumPy: [
    { question: "What is the basic data structure in NumPy?", options: ["List", "Dictionary", "Array", "Set"], correct: 2 },
    { question: "How do you create a NumPy array from a list?", options: ["np.list()", "np.array()", "np.create()", "np.make()"], correct: 1 },
    { question: "What function calculates the sum of array elements?", options: ["np.add()", "np.sum()", "np.total()", "np.calc()"], correct: 1 }
  ]
};

function getJobSkills(jobRole) {
  return JOB_SKILLS[jobRole] || {};
}

function getJobDescription(jobRole) {
  return JOB_DESCRIPTIONS[jobRole] || "";
}

function getLearningResource(skill) {
  return LEARNING_RESOURCES[skill] || {
    courses: ["Course not found"],
    websites: ["Visit official documentation"],
    duration: "Self-paced"
  };
}

function getAllJobRoles() {
  return Object.keys(JOB_SKILLS);
}

function getSkillQuestions(skill) {
  return SKILL_QUESTIONS[skill] || [];
}

module.exports = {
  JOB_SKILLS,
  getJobSkills,
  getJobDescription,
  getLearningResource,
  getAllJobRoles,
  getSkillQuestions
};