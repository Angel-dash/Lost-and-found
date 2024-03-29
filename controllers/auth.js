const mysql = require("mysql");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const db= mysql.createConnection(
    {
        host :process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password:process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
);

exports.index = (req, res) =>
{
    console.log(req.body);
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    db.query('SELECT email FROM users WHERE email = ?', [email], async(error,results)=> {
        if(error)
        {
            console.log(error);
        }
        
        if(results.length > 0)
        {
            return res.render('index',
            {
                message:'Email is already in use.'
            })
        }

        else if(password!==confirmPassword)
        {
            return res.render('index',
            {
                message:'Passwords do not match'
            })
        }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword)
    
    db.query('INSERT INTO users SET ? ', {name:name, email:email, password:hashedPassword}, (error,results) =>
        {
            if(error)
            {
                console.log(error)
            }
            else{
                console.log(results)
                return res.render('index',
            {
                message:'User Registered'
            })
            }
        })
    })
}



exports.index = async (req, res) => {
    try {
        const {email, password} = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) =>{
        console.log(results)
        if(results.length>0){
            if(!results|| !(await bcrypt.compare(password, results[0].password)))
        {
            res.status(401).render('index', {
                message: "Email or password is incorrect"
            })
        }
        else{
            const id = results[0].id;
            const token = jwt.sign({ id },process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })

            console.log("The token is" + token)

            const cookieOptions = {
                expires : new Date(
                    Date.now()+ process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                ), httpOnly: true
            }
            res.cookie('jwt', token, cookieOptions)
            res.status(200).redirect('postandclaim')
            
        }
    }
    })

  }catch (error) {
        console.log(error)
    }
}
