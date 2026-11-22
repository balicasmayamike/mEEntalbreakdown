window.QB=window.QB||{};
// Add questions by appending objects below. Keep ids unique.
QB.MATH=[
{id:"math-nm1-001",subject:"MATH",subtopic:"Numerical Methods & Data Analysis (Part 1)",question:"Using Newton-Raphson on $f(x)=x^2-2$ with $x_0=1$, find $x_1$.",choices:{A:"1.25",B:"1.5",C:"1.4",D:"2"},answer:"B",solution:"$x_1=x_0-\\frac{f(x_0)}{f'(x_0)}=1-\\frac{-1}{2}=1.5$"},
{id:"math-nm1-002",subject:"MATH",subtopic:"Numerical Methods & Data Analysis (Part 1)",question:"Estimate $\\int_0^2 x^2\\,dx$ using the trapezoidal rule with $n=2$.",choices:{A:"2.667",B:"3",C:"2.5",D:"4"},answer:"B",solution:"$h=1$: $\\frac{1}{2}[0+2(1)+4]=3$"},
{id:"math-nm1-003",subject:"MATH",subtopic:"Numerical Methods & Data Analysis (Part 1)",question:"Population standard deviation of 2, 4, 4, 4, 5, 5, 7, 9?",choices:{A:"2",B:"2.5",C:"4",D:"5"},answer:"A",solution:"Mean $=5$; $\\sum(x-\\mu)^2=32$; $\\sigma=\\sqrt{32/8}=2$"},
{id:"math-alg-001",subject:"MATH",subtopic:"Algebra",question:"Sum of the roots of $2x^2-6x+1=0$?",choices:{A:"3",B:"-3",C:"6",D:"1/2"},answer:"A",solution:"$-b/a=6/2=3$"}
];
