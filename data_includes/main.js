
PennController.ResetPrefix(null);
PennController.DebugOff() // use for the final version
PennController.AddHost("https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/"); // loads pictures from external server (pre-test 3 only)

// --------------------------------------------------------------------------------------------------------------  
// Preamble

var progressBarText = "Verbleibend"; //Changes the text of the progress bar

const replacePreloadingMessage = ()=>{   //Changes the Preloading Message
    const preloadingMessage = $(".PennController-PennController > div");
if (preloadingMessage.length > 0 && preloadingMessage[0].innerHTML.match(/^<p>Please wait while the resources are preloading/))
    preloadingMessage.html("<p>Bitte warten Sie einen Moment, w&auml;hrend die Medien laden. Dies kann bis zu 1 Minute dauern.</p>");
window.requestAnimationFrame( replacePreloadingMessage );
};
window.requestAnimationFrame( replacePreloadingMessage );

// --------------------------------------------------------------------------------------------------------------
// create cumulative function
cumulative = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') ); // 'sentence.split('*')' = '*' defines the chunk boundaries (in the .csv)
    let textName = 'cumulative'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' '))
    //.print()
    .settings.css("font-family","courier")
    .settings.css("font-size", "20px")
    .cssContainer({"width": "78vw"})
    .print("15vw","40vh")
    //.settings.css("font-size", "0.5em")  
    
    ];
// COURIER as font
// We'll go through each word, and add two command blocks per word
for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('cumulative'+i+'_'+words[i], " ").log().wait() , // Wait for (and log) a press on Space; will log "cumulative"+number-of-region_sentence-chunk
                         //getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w)).join(' ')) ]); // Show word; to make cumulative changed n==i?words to n<=i?words (print words less than or equal to i-region)
                         getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w).replace(/\s/g,"&nbsp;")).join(' ')) ]);

if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove()); 
return cmds;
};

//Create picking function
function Pick(set,n) {
    assert(set instanceof Object, "First argument of pick cannot be a plain string" );
    n = Number(n);
    if (isNaN(n) || n<0) 
        n = 0;
    this.args = [set];
    this.runSet = null;
    set.remainingSet = null;
    this.run = arrays => {
        if (this.runSet!==null) return this.runSet;
        const newArray = [];
        if (set.remainingSet===null) {
        if (set.runSet instanceof Array) set.remainingSet = [...set.runSet];
        else set.remainingSet = arrays[0];
    }
        for (let i = 0; i < n && set.remainingSet.length; i++)
            newArray.push( set.remainingSet.shift() );
    this.runSet = [...newArray];
    return newArray;
}
}
    function pick(set, n) { return new Pick(set,n); }
        
        critical = randomize("critical_trials")
        fillers = randomize("fillers");

// --------------------------------------------------------------------------------------------------------------
// Establish sequence, with randomised items
PennController.Sequence(  "demographics", "instructions1", "preloadPractice", "preloadCritical","preloadFillers", "practice_trials", "instructions2", 
                         rshuffle(pick(critical,8),pick(fillers,10)),"break",
                         rshuffle(pick(critical,8),pick(fillers,10)),"break",
                         rshuffle(pick(critical,8),pick(fillers,10)), 
                         "post-task-intro", "post-task", "post_task2_intro", "practice_trials_post2", "post_task2_intro2", randomize("post_task2"),
                         "end_post_task2" ,"post-ques", "send", "final");
//PennController.Sequence( "post-task-intro", "post-task", "post_task2_intro", "practice_trials_post2", "post_task2_intro2", "post_task2", "end_post_task2" ,"post-ques", "break", "critical_trials", "fillers", rshuffle(pick(critical,7),pick(fillers,10)),"break",
//rshuffle(pick(critical,7),pick(fillers,10)),"break", 
//rshuffle(pick(critical,6),pick(fillers,10)),"break",
//"practice_trials","demographics", "preloadFillers","fillers","demographics","post_task_intro1", "practice_trials_post", randomize("post_task"), "end_post_task" ,"post-ques", "send", "final");


//====================================================================================================================================================================================================================
// 1. Welcome page/demographics
PennController("demographics",
               // ENTER Clickworker ID
               newText("welcometext", "<p><b>Herzlich willkommen zu unserem Experiment!</b><p>")
               .settings.css("font-size", "30px")
               ,
               newCanvas("welcomecanvas", 1000, 125)
               .settings.add("center at 50%", 0, getText("welcometext") )
               .print()
               ,
               newTextInput("cwID", "")
               .before(newText("cwID", "Bevor wir beginnen, geben Sie bitte Ihre Prolific-ID ein: ")
                       .settings.css("font-size", "20px"))
               .size(100, 20)
               .settings.center()
               .print()
               ,
               newText("blank","<p>")
               .print()
               ,
               newButton("start", "Weiter")
               .settings.center()
               .print()
               .wait(getTextInput("cwID")
                     .test.text(/[^\s]+/)  // this makes sure that it's not left blank
                     .success()
                     .failure(
                         newText("IDerror","<p><br>Bitte tragen Sie bitte Ihre Prolific-ID ein.<p>")
                         .settings.color("red")
                         .settings.center()
                         .print()
                     ))
               ,  
               getCanvas("welcomecanvas")
               .remove()
               ,
               getTextInput("cwID")
               .remove()
               ,
               getButton("start")
               .remove()
               ,
               getText("IDerror")
               .remove()
               
               // ENTER DEMOGRAPHICS
               ,
               newText("welcometext2", "<p>Um an unserem Experiment teilnehmen zu k&ouml;nnen, ben&ouml;tigen wir Angaben zu Ihrer Person. Diese werden anonym ausgewertet. Genauere Informationen entnehmen Sie bitte dem Informationsblatt f&uuml;r Proband*innen.<p>")              
               .settings.css("font-size", "20px")
               ,
               newCanvas("welcomecanvas2", 1000, 125)
               .settings.add(0, 0, getText("welcometext2") )
               .print()
               ,
               newDropDown("age", "")
               .settings.add( "17 oder junger" , "18" , "19" , "20", "21" , "22" , "23", "24" , "25" , "26", "27" , "28" , "29", "30" , "31" , "32 oder &auml;lter" )
               ,
               newText("agetext", "Alter:")
               .settings.css("font-size", "20px")
               .settings.bold()
               //.settings.after( getDropDown("age") )    
               ,
               newCanvas("agecanvas", 1000, 45)
               .settings.add(0, 10, getText("agetext") )
               .settings.add(100, 8, getDropDown("age") )
               .print()    
               ,
               newText("Geschlecht", "Geschlecht:")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newDropDown("sex", "" )
               .settings.add( "&nbsp;weiblich&nbsp;", "&nbsp;m&auml;nnlich&nbsp;", "&nbsp;divers&nbsp;")
               ,
               newCanvas("sexcanvas", 1000, 40)
               .settings.add(0, 0, getText("Geschlecht") )
               .settings.add(120, 3, getDropDown("sex") )
               .print()
               ,
               newText("SpracheTest", "Haben Sie bis zum 5. Lebensjahr au&szlig;er Deutsch eine weitere Sprache gelernt?")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newTextInput("und zwar", "")
               .settings.hidden()
               ,
               newText("label input", "")
               .settings.after( getTextInput("und zwar") )
               ,
               newDropDown("language", "")
               .settings.log()
               .settings.add(  "nein", "ja, und zwar:")    
               .settings.after(  getText("label input") )
               .settings.callback(                                             //whenever an option is selected, do this:
                   getDropDown("language")
                   .test.selected("ja, und zwar:")                             //reveal the input box
                   .success( getTextInput("und zwar").settings.visible() )     //hide the input box
                   .failure( getTextInput("und zwar").settings.hidden()  )   
               )        
               ,
               newCanvas("languagecanvas", 1000, 25)
               .settings.add(0, 0, getText("SpracheTest") )
               .settings.add(690, 2, getDropDown("language") )
               .print()
               ,
               newText("<p> ")
               .print()
               ,
               newText("information", "<p>Bevor das Experiment beginnen kann, sollten Sie das <a href='https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/documentation/probanden_info_ONLINE_LifeFact.pdf' target='_blank' >Probandeninformationsblatt</a> sowie die <a href='https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/documentation/einversta%CC%88ndnis_ONLINE_LifeFact.pdf' target='_blank' >Einwilligungserkl&auml;rung</a> lesen.<p>")    
               .settings.css("font-size", "20px")
               ,
               newText("browser_info", "<p>Bitte beachten Sie, dass dieses Experiment nur mit den Browsern <b>Mozilla Firefox</b> und <b>Google Chrome</b> getestet wurde und nicht auf mobilen Ger&auml;ten funktioniert.<p>")
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvastwo", 1000, 180)
               .settings.add(0, 0, getText("browser_info") )
               .settings.add(0, 90, getText("information") )
               .print()
               ,
               newButton("okay", "Ich habe das Probandeninformationsblatt sowie die Einwilligungserkl&auml;rung gelesen und erkl&auml;re mich mit diesen einverstanden.")
               .settings.css("font-size", "15px")        
               .print()
               .wait()  
               ,
               newText("<p> ")
               .print()
               ,
               newButton("start2", "Experiment beginnen")
               .settings.center()  
               ,
               getDropDown("age")
               .test.selected()
               .success()
               .failure(
                   newText("Bitte geben Sie Ihr Alter an.")
                   .settings.color("red")
                   .print())   
               ,
               getDropDown("sex")
               .test.selected()
               .success()
               .failure(
                   newText("Bitte geben Sie Ihr Geschlecht an.")
                   .settings.color("red")
                   .print())
               ,
               getDropDown("language")
               .test.selected()
               .success()
               .failure(
                   newText("Bitte beantworten Sie die Frage zum Spracherwerb.")                   
                   .settings.color("red")
                   .print())      
               ,
               getDropDown("age").wait("first")
               ,
               getDropDown("sex").wait("first")
               ,
               getDropDown("language").wait("first")
               ,
               getButton("start2")
               .print()
               .wait()
               ,
               newVar("IDage")
               .settings.global()
               .set( getDropDown("age") )
               ,
               newVar("IDsex")
               .settings.global()
               .set( getDropDown("sex") )
               ,
               newVar("IDling")
               .settings.global()
               .set( getDropDown("language") )
               ,
               newVar("IDund zwar")
               .settings.global()
               .set( getTextInput("und zwar") )
               ,
               newVar("cwID")
               .settings.global()
               .set( getTextInput("cwID") )
               ,
               newVar("yes_key")
               .settings.global()
               // F-Version:
               .set( newText("yes_F"))
               // J-Version:
               //.set( newText("yes_J"))
              )  
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "demo" )
    .log( "type" , "demo" )              
    .log( "version" , "demo")
    .log( "letter" , "demo")
    
    .log( "sentence" , "demo")
    .log( "name" , "demo")
    .log( "real_name" , "demo")
    .log( "wrong_name" , "demo")
    .log( "name_match" , "demo")  
    .log( "year" , "demo")
    .log( "fact" , "demo")
    .log( "photo" , "demo")
    .log( "full_sentence" , "demo")
    .log( "condition" , "demo")
    
    .log( "life_mismatch" , "demo")
    .log( "fact_mismatch" , "demo")
    .log( "year_time" , "demo")
    .log( "fact_time" , "demo")
    .log( "year_fact" , "demo")
    .log( "list" , "demo")
    .log( "life_status" , "demo")
    .log( "occupation" , "demo")
    .log( "notice", "demo")
    .log( "about", "demo")
    
    .log( "easyhard", "demo")
    .log( "strategy", "demo")   
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);        //end of welcome screen

//====================================================================================================================================================================================================================
// 2. Intro/instructions
PennController( "instructions1" ,
                
                //Exclude the participants don’t meet the pre-determined criteria
                getVar("IDage")
                .testNot.is("17 oder junger")  // if particpant is NOT under 17
                .and( getVar("IDage")
                      .testNot.is("32 oder &auml;lter")  // AND if particpant is NOT over 32
                     )
                .and(getVar("IDling") 
                     .testNot.is("ja, und zwar:")   // AND participant is NOT bi-lingual
                    )
                .success()  // continue as normal
                .failure(   // otherwise, send results and end prematurely
                    SendResults()  // for this to work within a PC, I changed the PC.js file (Edit your file PennController.js and replace occurrences of e=window.items.indexOf(n); (there should be 2) with e=window.items&&window.items.indexOf(n);)
                    ,
                    newText("bye", "<p>Sie sind f&uuml;r diese Studie nicht teilnahmeberechtigt, da Sie Angaben gemacht haben, die nicht mit Ihren Prolific Vorscreening-Optionen &uuml;bereinstimmen"
                            + "<p>Bitte melden Sie sich auf Prolific ab, indem Sie die Taste 'Stop without completing' ausw&auml;hlen."
                           ) 
                    .settings.css("font-size", "20px")
                    .settings.color("red") 
                    .settings.bold()
                    .print() 
                    ,
                    newText("bye2", "<p><b>Warum wurden Sie ausgeschlossen?</b><p>Wir haben die Vorscreening-Optionen von Prolific genutzt, um Teilnehmer zu rekrutieren,<br> die "
                            + "zwischen <b>18 und 31 Jahre alt sind</b>,<br> deren erste/<b>Muttersprache Deutsch ist</b>,<br> und die <b>nur "
                            + "mit ihrer Muttersprache aufgewachsen sind </b> (was in diesem Fall Deutsch sein sollte).<p> Sie m&uuml;ssen auf der vorherigen Seite "
                            + "abweichende Angaben getroffen haben. Wenn Sie glauben, dass ein Fehler vorliegt, teilen Sie dies bitte den Forschern &uuml;ber Prolific mit.<br> Wir haben "
                            + "Ihre Antworten gespeichert und werden diese gerne &uuml;berpr&uuml;fen und Sie bezahlen, falls ein Fehler vorlag!"
                           ) 
                    .print() 
                    .wait()
                ) // END CHECKING OF DEMOGRAPHICS 
                
                ,
                newText("intro_instructions", "<p><b>Vielen Dank, dass Sie an diesem Experiment teilnehmen!</b><p><br><p>Das Experiment besteht aus vier Teilen: einer kurzen &Uuml;bungsrunde, dem Experiment selbst, zwei Verst&auml;ndnistests und einem kurzen Fragebogen. Insgesamt wird es ungef&auml;hr 20 Minuten dauern.<p> <p>Bitte versuchen Sie, das Experiment in einer angemessenen Zeit zu beenden. Sollten Sie l&auml;nger als 40 Minuten ben&ouml;tigen, sind Ihre Daten f&uuml;r uns nicht verwertbar.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("weiter", "<p>Dr&uuml;cken Sie die <b>Leertaste</b>, um weiter fortzufahren.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red")
                ,
                newCanvas("introcanvas",900, 450)
                .settings.add(0,0, getText("intro_instructions"))
                .settings.add(0,250, getText("weiter"))
                .print()   
                ,
                newKey("intro_instructions"," ")
                .wait()
                ,
                getCanvas("introcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,
                // F-Version:
                newText("intro_instructions2", "<p>In diesem Experiment werden Sie die Fotos verschiedener ber&uuml;hmter Pers&ouml;nlichkeiten aus aller Welt sehen. Einige dieser Pers&ouml;nlichkeiten werden Sie kennen, andere m&ouml;glicherweise nicht.<p><br>Sobald ein Foto erscheint, legen Sie Ihren <b>linken Zeigefinger</b> auf die Taste '<b>F</b>' und Ihren <b>rechten Zeigefinger</b> auf die Taste '<b>J</b>'. Dr&uuml;cken Sie <b>mit dem linken Zeigefinger = 'Ja'</b>, falls Sie diese Person kennen, und <b>mit dem rechten Zeigefinger = 'Nein'</b>, falls Sie diese Person nicht kennen.<p><p>Als N&auml;chstes werden Sie einen Satz sehen, der in Bl&ouml;cken pr&auml;sentiert wird und eine vergangene, gegenw&auml;rtige oder zuk&uuml;nftige Leistung der Person beschreibt. Sie werden jeweils nur einen Satzteil sehen. Um zum n&auml;chsten Satzteil fortzufahren, dr&uuml;cken Sie die <b>Leertaste</b>. <p>Nachdem Sie den Satz gelesen haben, ist Ihre Aufgabe zu entscheiden, ob der Satz in Bezug auf die gezeigte Pers&ouml;nlichkeit wahr ist. Dr&uuml;cken Sie <b>mit dem linken Zeigefinger = 'Ja'</b> oder <b>mit dem rechten Zeigefinger = 'Nein'</b>.<p><br> Um Ihnen den Einstieg zu erleichtern, blenden wir Ihnen die Anweisungen w&auml;hrend der Beispielrunde in <b>Rot</b> ein. F&uuml;r das tats&auml;chliche Experiment bekommen Sie aber nur die Fotos und S&auml;tze gezeigt.<p>")
                // J-Version:
                //newText("intro_instructions2", "<p>In diesem Experiment werden Sie die Fotos verschiedener ber&uuml;hmter Pers&ouml;nlichkeiten aus aller Welt sehen. Einige dieser Pers&ouml;nlichkeiten werden Sie kennen, andere m&ouml;glicherweise nicht.<p><br>Sobald ein Foto erscheint, legen Sie Ihren <b>linken Zeigefinger</b> auf die Taste '<b>F</b>' und Ihren <b>rechten Zeigefinger</b> auf die Taste '<b>J</b>'. Dr&uuml;cken Sie <b>mit dem linken Zeigefinger = 'Nein'</b>, falls Sie diese Person nicht kennen, und <b>mit dem rechten Zeigefinger = 'Ja'</b>, falls Sie diese Person kennen.<p><p>Als N&auml;chstes werden Sie einen Satz sehen, der in Bl&ouml;cken pr&auml;sentiert wird und eine vergangene, gegenw&auml;rtige oder zuk&uuml;nftige Leistung der Person beschreibt. Sie werden jeweils nur einen Satzteil sehen. Um zum n&auml;chsten Satzteil fortzufahren, dr&uuml;cken Sie die <b>Leertaste</b>. <p>Nachdem Sie den Satz gelesen haben, ist Ihre Aufgabe zu entscheiden, ob der Satz in Bezug auf die gezeigte Pers&ouml;nlichkeit wahr ist. Dr&uuml;cken Sie <b>mit dem linken Zeigefinger = 'Nein'</b> oder <b>mit dem rechten Zeigefinger = 'Ja'</b>.<p><br> Um Ihnen den Einstieg zu erleichtern, blenden wir Ihnen die Anweisungen w&auml;hrend der Beispielrunde in <b>Rot</b> ein. F&uuml;r das tats&auml;chliche Experiment bekommen Sie aber nur die Fotos und S&auml;tze gezeigt.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("weiter2", "<p><br>Dr&uuml;cken Sie die <b>Leertaste</b>, um mit den Beispielen zu beginnen.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red") 
                ,
                newCanvas("introcanvas2",900, 670)
                .settings.add(0,0, getText("intro_instructions2"))
                .settings.add(0,480, getText("weiter2"))
                .print()
                ,
                newKey("prac_start", " ")
                .wait()
                ,
                getCanvas("introcanvas2")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,
                getCanvas("introcanvas2")
                .remove()
               )
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")
    .log( "real_name" , "instructions")
    .log( "wrong_name" , "instructions")
    .log( "name_match" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "occupation" , "instructions")
    .log( "notice", "instructions")
    .log( "about", "instructions")
    
    .log( "easyhard", "instructions")
    .log( "strategy", "instructions")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 3. Preloading

CheckPreloaded( "practice_trials",10000)
    .label( "preloadPractice" );

CheckPreloaded( "critical_trials", 20000)
    .label( "preloadCritical" );

CheckPreloaded( "fillers", 10000)
    .label( "preloadFillers" )
    
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "preload" )
    .log( "type" , "preload" )              
    .log( "version" , "preload")
    .log( "letter" , "preload")
    
    .log( "sentence" , "preload")
    .log( "name" , "preload")
    .log( "real_name" , "preload")
    .log( "wrong_name" , "preload")
    .log( "name_match" , "preload")  
    .log( "year" , "preload")
    .log( "fact" , "preload")
    .log( "photo" , "preload")
    .log( "full_sentence" , "preload")
    .log( "condition" , "preload")
    
    .log( "life_mismatch" , "preload")
    .log( "fact_mismatch" , "preload")
    .log( "year_time" , "preload")
    .log( "fact_time" , "preload")
    .log( "year_fact" , "preload")
    .log( "list" , "preload")
    .log( "life_status" , "preload")
    .log( "occupation" , "preload")
    .log( "notice", "preload")
    .log( "about", "preload")
    
    .log( "easyhard", "preload")
    .log( "strategy", "preload")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 4. Practice items
PennController.Template( PennController.GetTable("practice.csv") // use subset.csv for celebrity names
                         ,
                         variable => ["practice_trials",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          newText ("instructions_example_pic","Ihnen bekannt?<p>")
                                          .settings.css("font-size", "20px")
                                          .settings.center()
                                          .settings.color("red")
                                          //.print()
                                          ,
                                          newCanvas("instr_example_pic_c", 800,10)
                                          .add("center at 50%",-90,getText("instructions_example_pic"))
                                          //.css( "border" , "solid 1px black" )
                                          .print()
                                          ,
                                          newImage("example_pic",  variable.file_name)
                                          .settings.size(400)
                                          .settings.center()
                                          //.print()
                                          ,
                                          newCanvas("example_pic_c", 800,400)
                                          .add("center at 50%",-70,getImage("example_pic"))
                                          //.css( "border" , "solid 1px black" )
                                          .print()
                                          ,
                                          //F-Version:  
                                          newText ("instructions_example_pic2"," <p><b>links = 'Ja' / rechts = 'Nein'</b><p>")
                                          //J-Version:
                                          //newText ("instructions_example_pic2"," <p><b>links = 'Nein' / rechts = 'Ja'</b><p>")
                                          .settings.css("font-size", "20px")
                                          .settings.center()
                                          .settings.color("red")
                                          //.print()
                                          ,
                                          newCanvas("instr_example_pic_c2", 800,30)
                                          .add("center at 50%",-100,getText("instructions_example_pic2"))
                                          //.css( "border" , "solid 1px black" )
                                          .print()
                                          ,
                                          newTimer("delay", 1000)    //no button can be pressed before 200ms
                                          .start()
                                          .wait()
                                          ,                           
                                          newKey("q_example_pic", "FJ")
                                          .settings.log()
                                          .wait()                                   
                                          ,
                                          getImage("example_pic")
                                          .remove()
                                          ,
                                          getCanvas("instr_example_pic_c")
                                          .remove()
                                          ,
                                          getCanvas("example_pic_c")
                                          .remove()
                                          ,
                                          getCanvas ("instr_example_pic_c2")
                                          .remove()
                                          ,
                                          getKey("q_example_pic")
                                          .remove()
                                          ,
                                          newCanvas("crit_instructions", 600, 150)
                                          .center()
                                          .add("center at 50%",0,newText ("crit_instru","Dr&uuml;cken Sie die <b>Leertaste</b>,um den n&auml;chsten Satzteil anzusehen.")
                                               .settings.css("font-size", "20px")
                                               .settings.center()
                                               .settings.color("red"))
                                          .print()
                                          ,     
                                          ...cumulative(variable.sentence_spr, "remove")
                                      ,
                                      getCanvas("crit_instructions")
                                      .remove()
                                      ,
                                      newCanvas("bio_instructions", 800, 90)
                                      .center()
                                      // F-Version:
                                      .add("center at 50%",0,newText ("ex_ctit_task", "Ist der Satz wahr in Bezug auf die gezeigte Pers&ouml;nlichkeit? <br> <p><b>links = 'Ja' / rechts = 'Nein'</b><p>")
                                           //J-Version:
                                           //.add("center at 50%",0,newText ("ex_ctit_task", "Ist der Satz wahr in Bezug auf die gezeigte Pers&ouml;nlichkeit? <br> <p><b>links = 'Nein' / rechts = 'Ja'</b><p>")  
                                           .settings.css("font-size", "20px")
                                           .settings.center()
                                           .settings.color("red"))
                                      .print()
                                      ,
                                      newImage("checkmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                      .size(50,50)
                                      ,
                                      newImage("crossmark", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                      .size(50,50)
                                      ,
                                      newCanvas("yes_no", 800,200)
                                      // F-Version:
                                      .add( 290 , "middle at 50%" , getImage("checkmark") )
                                      .add( 450 , "middle at 50%", getImage("crossmark") )
                                      // J-Version:
                                      //.add(  290 , "middle at 50%" , getImage("crossmark") )
                                      //.add( 450 , "middle at 50%" , getImage("checkmark") )
                                      .print()
                                      ,
                                      newKey("q_example_sent", "FJ")
                                      .settings.log()
                                      .wait() 
                                      ,
                                      getCanvas("bio_instructions")
                                      .remove()
                                      ,      
                                      getText("ex_ctit_task")
                                      .remove()
                                      ,
                                      getCanvas("yes_no")
                                      .remove()
                                      ,
                                      getKey("q_example_sent", "FJ")
                                      .remove()
                                      ,           
                                      newText("pleasewait", "...")
                                      .settings.css("font-size", "25px")
                                      .settings.center()
                                      .settings.bold()
                                      .print("center at 50%", 300)
                                      ,
                                      newTimer("wait", 1000)
                                      .start()
                                      .wait()
                                      ,
                                      getText("pleasewait")
                                      .remove() 
                                      )
                                      
                                      .log("clickworkerID", getVar("cwID"))                         
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("IDund zwar"))
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "item" , variable.item )
                                      .log( "type" , variable.type )              
                                      .log( "version" , variable.version)
                                      .log( "letter" , variable.letter)
                                      
                                      .log( "sentence" , variable.sentence)
                                      .log( "name" , variable.name)
                                      .log( "real_name" , variable.real_name)
                                      .log( "wrong_name" , variable.wrong_name)
                                      .log( "name_match" , variable.name_match)  
                                      .log( "year" , variable.year)
                                      .log( "fact" , variable.fact)
                                      .log( "photo" , variable.file_name)
                                      .log( "full_sentence" , variable.full_sentence)
                                      .log( "condition" , variable.condition)
                                      
                                      .log( "life_mismatch" , variable.life_mismatch)
                                      .log( "fact_mismatch" , variable.fact_mismatch)
                                      .log( "year_time" , variable.year_time)
                                      .log( "fact_time" , variable.fact_time)
                                      .log( "year_fact" , variable.year_fact)
                                      .log( "list" , variable.list)
                                      .log( "life_status" , variable.life_status)
                                      .log( "occupation" , variable.occupation)
                                      .log( "notice", "practice")
                                      .log( "about", "practice")
                                      
                                      .log( "easyhard", "practice")
                                      .log( "strategy", "practice")
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
                                      
                                      .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
                                      .setOption("hideProgressBar", true)
                                     ]); 

//====================================================================================================================================================================================================================
// 5. Instructions before experiment
PennController( "instructions2" ,
                newText("intro_experiment", "<p>Die &Uuml;bungsrunde ist abgeschlossen. Jetzt wird das Experiment beginnen.<p><br> <p>Ihnen wird immer zuerst ein Foto gezeigt und anschlie&szlig;end ein Satz.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("intro_experiment2", "<p>Sobald ein Foto erscheint, legen Sie Ihren <b>linken Zeigefinger</b> auf die Taste '<b>F</b>' und Ihren <b>rechten Zeigefinger</b> auf die Taste '<b>J</b>'.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red")
                ,
                //F-Version:
                newText("intro_experiment2_1","<p><b>1.</b> Anworten Sie bitte ob Sie die Person kennen: <b>linker Zeigefinger = 'Ja' / rechter Zeigefinger = 'Nein'</b>.<p><p><b>2.</b> Lesen Sie den Satz: <b>um zum n&auml;chsten Satzteil fortzufahren, dr&uuml;cken Sie die Leertaste</b>.<p> <p><b>3.</b> Antworten Sie, ob der Satz in Bezug auf die gezeigte Pers&ouml;nlichkeit wahr ist: <b>linker Zeigefinger = 'Ja' / rechter Zeigefinger = 'Nein'</b>.")
                //J-Version:
                //newText("intro_experiment2_1","<p><b>1.</b> Anworten Sie bitte ob Sie die Person kennen: <b>linker Zeigefinger = 'Nein' / rechter Zeigefinger = 'Ja'</b>.<p><p><b>2.</b> Lesen Sie den Satz: <b>um zum n&auml;chsten Satzteil fortzufahren, dr&uuml;cken Sie die Leertaste</b>.<p> <p><b>3.</b> Antworten Sie, ob der Satz in Bezug auf die gezeigte Pers&ouml;nlichkeit wahr ist: <b>linker Zeigefinger = 'Nein' / rechter Zeigefinger = 'Ja'</b>.")
                .settings.css("font-size", "20px")
                ,
                newText("intro_experiment3", "<p>Es wird zwei kurze Pausen von 20 Sekunden geben. Nutzen Sie diese, um sich kurz zu entspannen oder die Augen vom Bildschirm zu nehmen. Viel Spa&szlig;!</p>")
                .settings.css("font-size", "20px")        
                ,
                newCanvas("instructions_canvas", 880, 475)
                .settings.add(0, 0, getText("intro_experiment") )
                .settings.add(0, 120, getText("intro_experiment2") )
                .settings.add(0, 200, getText("intro_experiment2_1") )
                .settings.add(0, 360, getText("intro_experiment3") )
                .print()    
                ,
                newButton("start_experiment3" ,"Experiment beginnen")
                .settings.center()
                .print()
                .wait()
                ,
                getCanvas("instructions_canvas")
                .remove()
                ,
                getButton("start_experiment3")
                .remove()
                ,
                newText("instructions_key", "<br><b>Legen Sie Ihre Zeigefinger auf die Tasten und dr&uuml;cken Sie die 'Ja-Taste', um  das Experiment zu beginnen.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                // F-Version: 
                newKey("continue_Ja", "F")
                //J-Version:
                //newKey("continue_Ja", "J")
                .wait()
                ,  
                getText("instructions_key")
                .remove()
                ,
                newTimer(1000)
                .start()
                .wait()
               )                                //end of experiment instructions screen 
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")
    .log( "real_name" , "instructions")
    .log( "wrong_name" , "instructions")
    .log( "name_match" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "occupation" , "instructions")
    .log( "notice", "instructions")
    .log( "about", "instructions")
    
    .log( "easyhard", "instructions")
    .log( "strategy", "instructions")    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 6. Critical items
PennController.Template( PennController.GetTable("master_stimuli_spr12.csv") // use subset.csv for celebrity names
                         .filter("type" , "critical")
                         ,
                         variable => ["critical_trials", 
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          newImage("picture", variable.file_name)
                                          .settings.size(400)                                                      
                                          .center()
                                          //.print()
                                          ,
                                          newCanvas("pic_c", 800,40)
                                          .add("center at 50%",-20,getImage("picture"))
                                          //.css( "border" , "solid 1px black" )
                                          .print()
                                          ,
                                          newTimer("delay6", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          newKey("question_pic", "FJ")
                                          .settings.log()
                                          .wait()                                   
                                          ,
                                          getCanvas("pic_c")
                                          .remove()
                                          ,  
                                          getKey("question_pic")
                                          .remove()
                                          ,   
                                          
                                          ...cumulative(variable.sentence_spr, "remove")
                                      ,
                                      newImage("checkmark2", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                      .size(50,50)
                                      ,
                                      newImage("crossmark2", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                      .size(50,50)
                                      ,
                                      newCanvas("yes_no2", 450,40)
                                      // F-Version:
                                      .add(  90 , "22vh"  , getImage("checkmark2") )
                                      .add( 310 , "22vh" , getImage("crossmark2") )
                                      // J-Version:
                                      //.add(  90 ,"22vh", getImage("crossmark2") )
                                      //.add( 310 ,"22vh", getImage("checkmark2") )
                                      .print()
                                      ,
                                      newKey("q_sent", "FJ")
                                      .settings.log()
                                      .wait() 
                                      ,
                                      getCanvas("yes_no2")
                                      .remove()
                                      ,
                                      getKey("q_sent", "FJ")
                                      .remove()
                                      ,                           
                                      newText("pleasewait", "...")
                                      .settings.css("font-size", "25px")
                                      .settings.center()
                                      .settings.bold()
                                      .print("center at 50%",  "middle at 40%")
                                      ,
                                      newTimer("wait", 1000)
                                      .start()
                                      .wait()
                                      ,
                                      getText("pleasewait")
                                      .remove()
                                      )                     
                                      
                                      .log("clickworkerID", getVar("cwID"))                         
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("IDund zwar"))
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "item" , variable.item )
                                      .log( "type" , variable.type )              
                                      .log( "version" , variable.version)
                                      .log( "letter" , variable.letter)
                                      
                                      .log( "sentence" , variable.sentence)
                                      .log( "name" , variable.name)
                                      .log( "real_name" , variable.real_name)
                                      .log( "wrong_name" , variable.wrong_name)
                                      .log( "name_match" , variable.name_match)  
                                      .log( "year" , variable.year)
                                      .log( "fact" , variable.fact)
                                      .log( "photo" , variable.file_name)
                                      .log( "full_sentence" , variable.full_sentence)
                                      .log( "condition" , variable.condition)
                                      
                                      .log( "life_mismatch" , variable.life_mismatch)
                                      .log( "fact_mismatch" , variable.fact_mismatch)
                                      .log( "year_time" , variable.year_time)
                                      .log( "fact_time" , variable.fact_time)
                                      .log( "year_fact" , variable.year_fact)
                                      .log( "list" , variable.list)
                                      .log( "life_status" , variable.life_status)
                                      .log( "occupation" , variable.occupation)
                                      .log( "notice", "critical")
                                      .log( "about", "critical")
                                      
                                      .log( "easyhard", "critical")
                                      .log( "strategy", "critical")   
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
                                      
                                     ]); 

//====================================================================================================================================================================================================================
// 6.1 Fillers
PennController.Template( PennController.GetTable("master_stimuli_spr12.csv") // use subset.csv for celebrity names
                         .filter("type" , "filler")
                         ,
                         variable => ["fillers",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          newImage("picture_filler", "fillers/"+variable.file_name)
                                          .settings.size(400)                                                      
                                          .center()
                                          .print()
                                          ,
                                          newCanvas("pic_filler_c", 800,400)
                                          .add("center at 50%",-20,getImage("picture_filler"))
                                          //.css( "border" , "solid 1px black" )
                                          .print()
                                          ,
                                          newTimer("delay6", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          newKey("question_pic_filler", "FJ")
                                          .settings.log()
                                          .wait()                                   
                                          ,
                                          getCanvas("pic_filler_c")
                                          .remove()
                                          ,  
                                          getKey("question_pic_filler")
                                          .remove()
                                          ,   
                                          
                                          ...cumulative(variable.sentence_spr, "remove")
                                      ,
                                      newImage("checkmark3", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/checkmark.jpeg")
                                      .size(50,50)
                                      ,
                                      newImage("crossmark3", "https://amor.cms.hu-berlin.de/~pallesid/dfg_pretests/pictures/crossmark.png")
                                      .size(50,50)
                                      ,
                                      newCanvas("yes_no3", 450,40)
                                      // F-Version:
                                      .add(  90 , "22vh" , getImage("checkmark3") )
                                      .add( 310 , "22vh" , getImage("crossmark3") )
                                      // J-Version:
                                      //.add(  90 , "22vh" , getImage("crossmark3") )
                                      //.add( 310 , "22vh" , getImage("checkmark3") )
                                      .print()
                                      
                                      ,
                                      newKey("q_sent", "FJ")
                                      .settings.log()
                                      .wait() 
                                      ,
                                      getCanvas("yes_no3")
                                      .remove()
                                      ,
                                      getKey("q_sent", "FJ")
                                      .remove()
                                      ,                           
                                      newText("pleasewait", "...")
                                      .settings.css("font-size", "25px")
                                      .settings.center()
                                      .settings.bold()
                                      .print("center at 50%", "middle at 40%")
                                      ,
                                      newTimer("wait", 1000)
                                      .start()
                                      .wait()
                                      ,
                                      getText("pleasewait")
                                      .remove()
                                      )                     
                                      
                                      .log("clickworkerID", getVar("cwID"))                         
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("IDund zwar"))
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "item" , variable.item )
                                      .log( "type" , variable.type )              
                                      .log( "version" , variable.version)
                                      .log( "letter" , variable.letter)
                                      
                                      .log( "sentence" , variable.sentence)
                                      .log( "name" , variable.name)
                                      .log( "real_name" , variable.real_name)
                                      .log( "wrong_name" , variable.wrong_name)
                                      .log( "name_match" , variable.name_match)  
                                      .log( "year" , variable.year)
                                      .log( "fact" , variable.fact)
                                      .log( "photo" , variable.file_name)
                                      .log( "full_sentence" , variable.full_sentence)
                                      .log( "condition" , variable.condition)
                                      
                                      .log( "life_mismatch" , variable.life_mismatch)
                                      .log( "fact_mismatch" , variable.fact_mismatch)
                                      .log( "year_time" , variable.year_time)
                                      .log( "fact_time" , variable.fact_time)
                                      .log( "year_fact" , variable.year_fact)
                                      .log( "list" , variable.list)
                                      .log( "life_status" , variable.life_status)
                                      .log( "occupation" , variable.occupation)
                                      .log( "notice", "critical")
                                      .log( "about", "critical")
                                      
                                      .log( "easyhard", "filler")
                                      .log( "strategy", "filler")   
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
                                      
                                     ]); 

//====================================================================================================================================================================================================================
// 7. Break

PennController( "break" ,
                newText("break_text", "<p><b>Zeit f&uuml;r eine kleine Pause!</b> <br><p>Entspannen Sie sich und nehmen Sie kurz die Augen vom Bildschirm.<br><p><b>Das Experiment geht nach 20 Sekunden automatisch weiter.</br></b><p>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()    
                ,
                newTimer("break_timer", 20000)
                .start() 
                .wait()                
                ,
                getText("break_text")
                .remove()                
                ,
                newText("instructions_key2", "<br><b>Legen Sie Ihre Zeigefinger auf die Tasten und dr&uuml;cken Sie die 'Ja-Taste', um  das Experiment zu beginnen.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                //F-Version:
                newKey("continue_Ja2", "F")
                //J-Version:
                //newKey("continue_Ja2", "J")
                .wait()
                ,  
                getText("instructions_key2")
                .remove()                  
                ,
                newTimer(1000)
                .start()
                .wait()             
               ) 
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "break" )
    .log( "type" , "break" )              
    .log( "version" , "break")
    .log( "letter" , "break")
    
    .log( "sentence" , "break")
    .log( "name" , "break")
    .log( "real_name" , "break")
    .log( "wrong_name" , "break")
    .log( "name_match" , "break")  
    .log( "year" , "break")
    .log( "fact" , "break")
    .log( "photo" , "break")
    .log( "full_sentence" , "break")
    .log( "condition" , "break")
    
    .log( "life_mismatch" , "break")
    .log( "fact_mismatch" , "break")
    .log( "year_time" , "break")
    .log( "fact_time" , "break")
    .log( "year_fact" , "break")
    .log( "list" , "break")
    .log( "life_status" , "break")
    .log( "occupation" , "break")
    .log( "notice", "break")
    .log( "about", "break")
    
    .log( "easyhard", "break")
    .log( "strategy", "break")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
//Comprehension test (1) explanation screen 

PennController( "post-task-intro",
                newText("comp1_1", "<p>Der haupts&auml;chliche Teil des Experiments ist nun abgeschlossen. <b>Bitte bleiben Sie aber unbedingt noch bis zum Ende!</b><p>")
                .settings.css("font-size", "20px")
                ,        
                newText("comp1_2", "<p>Es folgt nun noch ein kurzer Verst&auml;ndnistest, um sicherzustellen, dass Sie w&auml;hrend des Experiments aufmerksam und konzentriert waren bzw. Ihre Antworten bewusst getroffen haben.<p>")
                .settings.css("font-size", "20px")
                ,
                newText("comp1_3", "<p>Ihnen wird gleich ein Feld mit mehreren Namen angezeigt. Neben jedem Namen befindet sich ein K&auml;stchen, das Sie ausw&auml;hlen k&ouml;nnen. Bitte markieren Sie diejenigen Namen, bei denen Sie glauben, dass Sie im Experiment vorkamen.<p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("compCanv", 900, 300)
                .settings.add(0,0, getText("comp1_1"))
                .settings.add(0,100, getText("comp1_2")  )
                .settings.add(0,200, getText("comp1_3")  )
                .print()   
                ,
                newButton("compStart", "Verst&auml;ndnistest beginnen")
                .settings.center()
                .print()
                .wait()
               )
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")
    .log( "real_name" , "instructions")
    .log( "wrong_name" , "instructions")
    .log( "name_match" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "occupation" , "instructions")
    .log( "notice", "instructions")
    .log( "about", "instructions")
    
    .log( "easyhard", "instructions")
    .log( "strategy", "instructions")    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 8. Comprehension test (1)

var names = [];
var test;
function handleNames(row){close
    if (row.name=="void"){
    names = names.sort(v=>1-2*(Math.random()>=0.5));
                          return newTrial("post-task",             newText("instructions", "<p>Bitte w&auml;hlen Sie diejenigen Namen aus,die w&auml;hrend des Experiments vorgekommen sind. <br> W&auml;hlen Sie hierf&uuml;r jeweils das linke K&auml;stchen f&uuml;r <b>Ja</b> bzw. das rechte K&auml;stchen f&uuml;r <b>Nein</b> aus.<p><p><b> Sie k&ouml;nnen das Experiment nur dann beenden, wenn Sie f&uuml;r alle Namen eine Auswahl getroffen haben.</b><p>")
                                          .settings.center()
                                          .settings.css("font-size", "20px")
                                          ,
                                          newCanvas("screen", 1500, 450)
                                          .add(350, 100, getText("instructions")) // leftmost ja/nein
                                          .add(285, 245, newText("Ja / Nein")) // leftmost ja/nein
                                          .add(650 , 245, newText("Ja / Nein")) // center ja/nein
                                          .add(990, 245, newText("Ja / Nein")) // rightmost ja/nein
                                          // names
                                          .add(250, 170 , newCanvas("names-1", "60%", "100%") ) // leftmost column
                                          .add( 620, 170, newCanvas("names-2", "60%", "100%") ) // center column
                                          .add( 960, 170 , newCanvas("names-3", "60%", "100%") ) // rightmost column
                                          .print( "font-size", "20px")
                                          ,
                                          ...names.map( (r,i) => {
                                              test = test || newFunction(v=>true).test.is(true);
                                              test = test.and( getScale(r.name+'-scale-'+r.condition+', life ='+r.life_status+'list ='+r.list+' type = '+r.type).test.selected() );
                                              return newText(r.name)
                                              .before(
                                              newScale(r.name+'-scale-'+r.condition+', life ='+r.life_status+'list ='+r.list+' type = '+r.type, "yes", "no") //global_z.css is needed to hide the lables "yes" & "no"
                                              .log()
                                              .print()
                                              )
                                              .print( "2em" , parseInt(6+(i%17)*2)+"em" , getCanvas("names-"+parseInt(1+i/17)) );
                                          })
                                              ,              
                                              newButton("continueb", "Experiment beenden")
                                              .print(640, 870)
                                              .wait(test)    //  would only proceed if all Scale elements are selected    
                                              )                           }
                                              names.push(row);
                                              return [];
                                          }
                                              Template( GetTable("master_stimuli_spr12.csv") .filter("type" , "post-task"),  row => handleNames(row) );


//====================================================================================================================================================================================================================
// 8. Comprehension test (2) explanation screen 
PennController( "post_task2_intro",
                newText("comp_1.1", "Es folgt nun noch ein Verst&auml;ndnistest, um festzustellen, wie gut Sie die gesehenen Pers&ouml;nlichkeiten kennen.<p>")
                .settings.css("font-size", "20px")    
                ,
                newText("comp_2.1", "<p>Legen Sie Ihren <b>linken Zeigefinger</b> auf die Taste '<b>F</b>' und Ihren <b>rechten Zeigefinger</b> auf die Taste '<b>J</b>'.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red")
                ,
                // F-Version:
                newText("comp_3.1", "<p>Sobald ein Foto erscheint, dr&uuml;cken Sie <b>mit dem linken Zeigefinger = 'Ja'</b>, falls Sie diese Person kennen, und <b>mit dem rechten Zeigefinger = 'Nein'</b>, falls Sie diese Person nicht kennen.<p> <p>Als N&auml;chstes tragen Sie den Namen der Person auf dem Foto in die Texteingabezeile ein und dr&uuml;cken Sie <b>'Enter'</b>.<p> <p>Werden Sie 'Am Leben?' gefragt, antworten Sie, ob Sie glauben, dass diese Person noch am Leben ist: <b>linker Zeigefinger = 'Ja' / rechter Zeigefinger = 'Nein'</b>.<p> <p>Danach werden Sie eine Jahreszahl sehen. Antworten Sie, ob Sie glauben, dass diese Person im genannten Jahr am Leben war: <b> linker Zeigefinger = 'Ja'/ rechter Zeigefinger = 'Nein'</b>.<p> <p>Im Anschluss wird Ihnen ein Gegenstand gezeigt und Sie werden gefragt, ob Sie die Person mit diesem Gegenstand assoziieren k&ouml;nnen. Dr&uuml;cken Sie auch hier: <b> linker Zeigefinger = 'Ja' / rechter Zeigefinger = 'Nein'</b>.<p> <p>Zuletzt werden Sie einen Name sehen. Antworten Sie, ob der Name dem Foto entspricht: <b>linker Zeigefinger = 'Ja'/ rechter Zeigefinger = 'Nein'</b>.<p>")
                // J-Version:
                // newText("comp_3.1", "<p>Sobald ein Foto erscheint, dr&uuml;cken Sie <b>mit dem linken Zeigefinger = 'Nein'</b>, falls Sie diese Person nicht kennen, und <b>mit dem rechten Zeigefinger = 'Ja'</b>, falls Sie diese Person kennen.<p> <p>Als N&auml;chstes tragen Sie den Namen der Person auf dem Foto in die Texteingabezeile ein und dr&uuml;cken Sie <b>'Enter'</b>.<p><p>Werden Sie 'Am Leben?' gefragt, antworten Sie, ob Sie glauben, dass diese Person noch am Leben ist: <b>linker Zeigefinger = 'Nein' / rechter Zeigefinger = 'Ja'</b>.<p> <p>Danach werden Sie eine Jahreszahl sehen. Antworten Sie, ob Sie glauben, dass diese Person im genannten Jahr am Leben war: <b> linker Zeigefinger = 'Nein'/ rechter Zeigefinger = 'Ja'</b>.<p> <p>Im Anschluss wird Ihnen ein Gegenstand gezeigt und Sie werden gefragt, ob Sie die Person mit diesem Gegenstand assoziieren k&ouml;nnen. Dr&uuml;cken Sie auch hier: <b> linker Zeigefinger = 'Nein' / rechter Zeigefinger = 'Ja'</b>.<p> <p>Zuletzt werden Sie einen Name sehen. Antworten Sie, ob der Name dem Foto entspricht: <b>linker Zeigefinger = 'Nein' / rechter Zeigefinger = 'Ja'</b>.<p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("introcanvas_comp.1",900, 590)
                .settings.add(0,0, getText("comp_1.1"))
                .settings.add(0,70, getText("comp_2.1"))
                .settings.add(0,100, getText("comp_3.1"))
                .print()
                ,
                newButton("weiter_comp1", "Weiter")
                .settings.center()
                .print()
                .wait()
                ,
                getCanvas("introcanvas_comp.1")
                .remove()
                ,
                getButton("weiter_comp1")
                .remove()
                ,
                newText("comp_4.1", "<p>Wenn Sie die anschlie&szlig;enden Fragen zur Jahreszahl oder der Person nicht beantworten k&ouml;nnen, <b>dr&uuml;cken Sie keine Tasten!</b> Das Experiment geht nach 5 Sekunden automatisch weiter.<p> <p>Wenn Sie den Namen der Person auf dem Foto nicht kennen, tragen Sie stattdessen deren Besch&auml;ftigung oder etwaige andere Assoziationen ein, die Sie zu dieser Person haben, und dr&uuml;cken Sie <b>'Enter'</b>.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red")
                ,
                //newText("comp_5.1", "<p>Um Ihnen den Einstieg zu erleichtern, blenden wir Ihnen die Anweisungen w&auml;hrend der Beispielrunde in <b>Rot</b> ein. F&uuml;r das tats&auml;chliche Experiment bekommen Sie aber nur die Gegenst&auml;nde, Jahre und Personen gezeigt.<p>")
                //.settings.css("font-size", "20px")
                //,
                newCanvas("introcanvas_comp2.1", 900, 150)
                .settings.add(0,0, getText("comp_4.1"))
                //.settings.add(0,150, getText("comp_5.1"))
                .print()
                ,
                newButton("beispiel_beginnen_comp.1", "Beispiele beginnen")
                .settings.center()
                .print()
                .wait()
               )
    
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")
    .log( "real_name" , "instructions")
    .log( "wrong_name" , "instructions")
    .log( "name_match" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "occupation" , "instructions")
    .log( "notice", "instructions")
    .log( "about", "instructions")
    
    .log( "easyhard", "instructions")
    .log( "strategy", "instructions")    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
// 9. Practice round for post task (2) (Pretest 3)

PennController. Template( PennController.GetTable( "practice.csv"),
                          variable => PennController( "practice_trials_post2",
                                                      newText("instructions_example_pic_post","Ihnen bekannt?<p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      //.print()
                                                      ,
                                                      newCanvas("practice_trials_post_c", 800,8)
                                                      .add("center at 50%",-100,getText("instructions_example_pic_post"))
                                                      //.css( "border" , "solid 1px black" )
                                                      .print()
                                                      ,
                                                      newImage("example_pic_post", variable.file_name)
                                                      .settings.size(400)                                                      
                                                      .center()
                                                      //.print()
                                                      ,
                                                      newCanvas("example_pic_post_c", 800,300)
                                                      .add("center at 50%",-80,getImage("example_pic_post"))
                                                      //.css( "border" , "solid 1px black" )
                                                      .print()
                                                      ,
                                                      // F-Version:  
                                                      newText ("instructions_example_pic_post2"," <p><b>links = 'Ja' / rechts = 'Nein'</b><p>")
                                                      //J-Version:
                                                      //newText ("instructions_example_pic_post2"," <p><b>links = 'Nein' / rechts = 'Ja'</b><p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      //.print()
                                                      ,
                                                      newCanvas("instructions_example_pic_post_c2", 800,0)
                                                      .add("center at 50%",-15,getText("instructions_example_pic_post2"))
                                                      //.css( "border" , "solid 1px black" )
                                                      .print()
                                                      ,
                                                      newTimer("delay_post", 1000)    //no button can be pressed before 200ms
                                                      .start()
                                                      .wait()
                                                      ,                           
                                                      newKey("q_example_pic_post", "FJ")
                                                      .settings.log()
                                                      .wait()                                   
                                                      ,
                                                      getCanvas("practice_trials_post_c")
                                                      .remove()
                                                      ,
                                                      getCanvas("example_pic_post_c")
                                                      .remove()
                                                      ,
                                                      getText ("instructions_example_pic_post2")
                                                      .remove()
                                                      ,
                                                      getKey("q_example_pic_post")
                                                      .remove()
                                                      ,
                                                      newTimer("warte_post", 100) //if absent the "F" pressed in the previous tasks is displayed in the Input Box
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newText("name_task_post", "<p><br>Wie hei&szlig;t die Person auf dem Foto?<br><p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTextInput("name_practice_post", "")
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .log()
                                                      .print()
                                                      ,
                                                      newTimer("delay_name_post", 700)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newText("<p> ")
                                                      .print()  
                                                      ,
                                                      newText ("instr_contin_post", "<p><b>Enter</b> um weiter fortzufahren.<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,  
                                                      newKey("next_post", "Enter")
                                                      .callback(getTextInput("name_practice_post")
                                                                .disable())
                                                      .wait()
                                                      ,
                                                      getText("name_task_post")
                                                      .remove()
                                                      ,
                                                      getTextInput("name_practice_post")
                                                      .remove()
                                                      ,
                                                      getText ("instr_contin_post")
                                                      .remove()
                                                      ,
                                                      getKey("next_post")
                                                      .remove()
                                                      ,
                                                      newText ("instructions_example_alive_post", "Noch am Leben?<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_alive_post", "<br> Am Leben?" )
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()                                                          
                                                      .print()                                                    
                                                      ,
                                                      //F-Version:  
                                                      newText ("instructions_example_alive_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      // newText ("instructions_example_alive_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,                                                           
                                                      newTimer("delay_post2", 200)     //no button can be pressed before 200ms
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_alive_post", "FJ")
                                                      .callback( getTimer("time_out_post").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("example_alive_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_alive_post")
                                                      .remove()                                                         
                                                      ,
                                                      getText("instructions_example_alive_post2")
                                                      .remove()                                                         
                                                      ,  
                                                      getKey("q_example_alive_post")
                                                      .remove()
                                                      ,
                                                      newText ("instructions_example_year_post", "Im genannten Jahr am Leben?<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_year_post", "<br>"+ variable.year)
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .print()  
                                                      ,
                                                      //F-Version:
                                                      newText ("instructions_example_year_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      // newText ("instructions_example_year_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTimer("delay_post3", 500)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_year_post", "FJ")
                                                      .callback( getTimer("time_out_post2").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post2", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("example_year_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_year_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_year_post2")
                                                      .remove()
                                                      ,  
                                                      getKey("q_example_year_post")
                                                      .remove()
                                                      ,
                                                      newText ("instructions_example_fact_post", "Hat die Person damit zu tun?<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_fact_post", "<br>" + variable.fact)
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .print()                                                    
                                                      ,
                                                      //F-Version:
                                                      newText ("instructions_example_fact_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      //newText ("instructions_example_fact_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTimer("delay_post4", 500)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_fact_post", "FJ")
                                                      .callback( getTimer("time_out_post3").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post3", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("instructions_example_fact_post")
                                                      .remove()
                                                      ,
                                                      getText("example_fact_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_fact_post2")
                                                      .remove()
                                                      ,
                                                      getKey("q_example_fact_post")
                                                      .remove()                                                          
                                                      ,
                                                      newText ("instructions_example_name_post","Die Person auf dem Bild hei&szlig;t...<p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_name_post","<br>"+  variable.name)
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .print()
                                                      ,
                                                      //F-Version:
                                                      newText ("instructions_example_name_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      //newText ("instructions_example_name_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTimer("delay_post5", 500)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_name_post", "FJ")
                                                      .callback( getTimer("time_out_post4").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post4", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("example_name_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_name_post")
                                                      .remove()
                                                      ,
                                                      getText ("instructions_example_name_post2")
                                                      .remove()
                                                      ,
                                                      getKey("q_example_name_post")
                                                      .remove()
                                                      //,
                                                      //newText ("instructions_continue_post", "<p>Dr&uuml;cken Sie bitte die <b>Leertaste</b>, um weiter fortzufahren.<p>")  
                                                      // .settings.css("font-size", "20px")
                                                      //.settings.center()  
                                                      //.settings.color("red")                                                        
                                                      //.print()
                                                      // ,
                                                      // newKey("continue_post" ," ")
                                                      //.print()
                                                      //.wait()
                                                      //,
                                                      // getText("instructions_continue_post")
                                                      // .remove()
                                                      // ,  
                                                      //  getKey("continue_post")
                                                      // .remove()
                                                      
                                                      ,
                                                      newText("pleasewait_post", "...")
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .settings.bold()
                                                      .print()
                                                      ,
                                                      newTimer("wait_post", 1000)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      getText("pleasewait_post")
                                                      .remove()    
                                                     )
                          .log("clickworkerID", getVar("cwID"))                         
                          .log("age", getVar("IDage"))
                          .log("sex", getVar("IDsex"))
                          .log("L2", getVar("IDling"))
                          .log("whichL2", getVar("IDund zwar"))
                          .log( "yes_key" , getVar("yes_key"))
                          .log( "item" , variable.item )
                          .log( "type" , variable.type )              
                          .log( "version" , variable.version)
                          .log( "letter" , variable.letter)
                          
                          .log( "sentence" , variable.sentence)
                          .log( "name" , variable.name)
                          .log( "real_name" , variable.real_name)
                          .log( "wrong_name" , variable.wrong_name)
                          .log( "name_match" , variable.name_match)  
                          .log( "year" , variable.year)
                          .log( "fact" , variable.fact)
                          .log( "photo" , variable.file_name)
                          .log( "full_sentence" , variable.full_sentence)
                          .log( "condition" , variable.condition)
                          
                          .log( "life_mismatch" , variable.life_mismatch)
                          .log( "fact_mismatch" , variable.fact_mismatch)
                          .log( "year_time" , variable.year_time)
                          .log( "fact_time" , variable.fact_time)
                          .log( "year_fact" , variable.year_fact)
                          .log( "list" , variable.list)
                          .log( "life_status" , variable.life_status)
                          .log( "occupation" , variable.occupation)
                          .log( "notice", "practice")
                          
                          .log( "about", "practice")
                          .log( "easyhard", "practice")
                          .log( "strategy", "practice")
                          .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
                          
                          .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
                          .setOption("hideProgressBar", true)
                         ); 

//====================================================================================================================================================================================================================
// 10. Instructions before post task

PennController( "post_task2_intro2",
                newText("intro_comp", "<p>Jetzt wird der Verst&auml;ndnistest beginnen.<p> <p>Ihnen wird immer zuerst ein Foto gezeigt und anschlie&szlig;end die Texteingabezeile, die Frage 'Am Leben?', ein Jahr, ein Gegenstand und der Name.<p> <p><br>Anworten Sie bitte: <p><b>1. ob Sie die Person kennen,<p> <p>2. wie die Person hei&szlig;t,<p> <p>3. ob die Person noch am Leben ist, <p> <p>4. ob die Person im genannten Jahr am Leben war,<p> <p>5. ob Sie die Person mit dem Gegenstand assoziieren k&ouml;nnen,</b> und zuletzt,<p> <p><b>6. ob der Name dem Foto entspricht.</b><p>")
                .settings.css("font-size", "20px")
                ,
                //F-Version:
                newText("intro_comp2", "<p>Antworten Sie immer <b>mit dem linken Zeigefinger = 'Ja'</b> und <b>mit dem rechten Zeigefinger = 'Nein'</b>. Den Namen der Person tragen Sie in die Texteingabezeile ein und dr&uuml;cken Sie <b>'Enter'</b>.<p>")
                //J-Version:
                // newText("intro_comp2", "<p>Antworten Sie immer <b>mit dem linken Zeigefinger = 'Nein'</b> und <b>mit dem rechten Zeigefinger = 'Ja'</b>. Den Namen der Person tragen Sie in die Texteingabezeile ein und dr&uuml;cken Sie <b>'Enter'</b>.<p>")
                .settings.css("font-size", "20px")
                .settings.color("red")
                ,
                newText("intro_comp_1","<p><p>Wenn Sie die anschlie&szlig;enden Fragen zur Person nicht beantworten k&ouml;nnen, <b>dr&uuml;cken Sie keine Tasten!</b> Das Experiment geht nach 5 Sekunden automatisch weiter.<p> <p>Wenn Sie den Namen der Person auf dem Foto nicht kennen, tragen Sie stattdessen deren Besch&auml;ftigung oder etwaige andere Assoziationen ein, die Sie zu dieser Person haben.<p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("instructions_canvas_comp", 900, 660)
                .settings.add(0, 0, getText("intro_comp") )
                .settings.add(0, 420, getText("intro_comp2") )
                .settings.add(0, 480, getText("intro_comp_1") )
                .print()    
                ,
                newButton("start_comp3" ,"Verst&auml;ndnistest beginnen")
                .settings.center()
                .print()
                .wait()
                ,
                getCanvas("instructions_canvas_comp")
                .remove()
                ,
                getButton("start_comp3")
                .remove()
                ,
                newText("instructions_key_comp", "<br><b>Legen Sie Ihre Zeigefinger auf die Tasten und dr&uuml;cken Sie die 'Ja-Taste', um  das Experiment zu beginnen.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                //F-Version:
                newKey("continue_Ja_comp", "F")
                //J-Version:
                //newKey("continue_Ja_comp", "J")
                .wait()
                ,  
                getText("instructions_key_comp")
                .remove()
                ,
                newTimer(1000)
                .start()
                .wait()
               )                                //end of experiment instructions screen  
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "instructions" )
    .log( "type" , "instructions" )              
    .log( "version" , "instructions")
    .log( "letter" , "instructions")
    
    .log( "sentence" , "instructions")
    .log( "name" , "instructions")
    .log( "real_name" , "instructions")
    .log( "wrong_name" , "instructions")
    .log( "name_match" , "instructions")  
    .log( "year" , "instructions")
    .log( "fact" , "instructions")
    .log( "photo" , "instructions")
    .log( "full_sentence" , "instructions")
    .log( "condition" , "instructions")
    
    .log( "life_mismatch" , "instructions")
    .log( "fact_mismatch" , "instructions")
    .log( "year_time" , "instructions")
    .log( "fact_time" , "instructions")
    .log( "year_fact" , "instructions")
    .log( "list" , "instructions")
    .log( "life_status" , "instructions")
    .log( "occupation" , "instructions")
    .log( "notice", "instructions")
    .log( "about", "instructions")
    
    .log( "easyhard", "instructions")
    .log( "strategy", "instructions")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);  

//====================================================================================================================================================================================================================
// 11. Post task (Pretest 3)

PennController. Template( PennController.GetTable( "master_stimuli_spr12.csv")// change this line for the appropriate experimental list
                          .filter("type" , "critical")
                          ,  
                          variable => PennController( "post_task2"
                                                      ,
                                                      newText("instructions_example_pic_post","Ihnen bekannt?<p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      //.print()
                                                      ,
                                                      newCanvas("practice_trials_post_c", 800,8)
                                                      .add("center at 50%",-100,getText("instructions_example_pic_post"))
                                                      //.css( "border" , "solid 1px black" )
                                                      .print()
                                                      ,
                                                      newImage("example_pic_post", variable.file_name)
                                                      .settings.size(400)                                                      
                                                      .center()
                                                      //.print()
                                                      ,
                                                      newCanvas("example_pic_post_c", 800,300)
                                                      .add("center at 50%",-80,getImage("example_pic_post"))
                                                      //.css( "border" , "solid 1px black" )
                                                      .print()
                                                      ,
                                                      // F-Version:  
                                                      newText ("instructions_example_pic_post2"," <p><b>links = 'Ja' / rechts = 'Nein'</b><p>")
                                                      //J-Version:
                                                      //newText ("instructions_example_pic_post2"," <p><b>links = 'Nein' / rechts = 'Ja'</b><p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      //.print()
                                                      ,
                                                      newCanvas("instructions_example_pic_post_c2", 800,0)
                                                      .add("center at 50%",-15,getText("instructions_example_pic_post2"))
                                                      //.css( "border" , "solid 1px black" )
                                                      .print()
                                                      ,
                                                      newTimer("delay_post", 1000)    //no button can be pressed before 200ms
                                                      .start()
                                                      .wait()
                                                      ,                           
                                                      newKey("q_example_pic_post", "FJ")
                                                      .settings.log()
                                                      .wait()                                   
                                                      ,
                                                      getCanvas("practice_trials_post_c")
                                                      .remove()
                                                      ,
                                                      getCanvas("example_pic_post_c")
                                                      .remove()
                                                      ,
                                                      getText ("instructions_example_pic_post2")
                                                      .remove()
                                                      ,
                                                      getKey("q_example_pic_post")
                                                      .remove()
                                                      ,
                                                      newTimer("warte_post", 100) //if absent the "F" pressed in the previous tasks is displayed in the Input Box
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newText("name_task_post", "<p><br>Wie hei&szlig;t die Person auf dem Foto?<br><p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTextInput("name_practice_post", "")
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .log()
                                                      .print()
                                                      ,
                                                      newTimer("delay_name_post", 700)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newText("<p> ")
                                                      .print()  
                                                      ,
                                                      newText ("instr_contin_post", "<p><b>Enter</b> um weiter fortzufahren.<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,  
                                                      newKey("next_post", "Enter")
                                                      .callback(getTextInput("name_practice_post")
                                                                .disable())
                                                      .wait()
                                                      ,
                                                      getText("name_task_post")
                                                      .remove()
                                                      ,
                                                      getTextInput("name_practice_post")
                                                      .remove()
                                                      ,
                                                      getText ("instr_contin_post")
                                                      .remove()
                                                      ,
                                                      getKey("next_post")
                                                      .remove()
                                                      ,
                                                      newText ("instructions_example_alive_post", "Noch am Leben?<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_alive_post", "<br> Am Leben?" )
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()                                                          
                                                      .print()                                                    
                                                      ,
                                                      //F-Version:  
                                                      newText ("instructions_example_alive_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      // newText ("instructions_example_alive_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,                                                           
                                                      newTimer("delay_post2", 200)     //no button can be pressed before 200ms
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_alive_post", "FJ")
                                                      .callback( getTimer("time_out_post").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("example_alive_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_alive_post")
                                                      .remove()                                                         
                                                      ,
                                                      getText("instructions_example_alive_post2")
                                                      .remove()                                                         
                                                      ,  
                                                      getKey("q_example_alive_post")
                                                      .remove()
                                                      ,
                                                      newText ("instructions_example_year_post", "Im genannten Jahr am Leben?<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_year_post", "<br>"+ variable.year)
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .print()  
                                                      ,
                                                      //F-Version:
                                                      newText ("instructions_example_year_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      // newText ("instructions_example_year_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTimer("delay_post3", 500)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_year_post", "FJ")
                                                      .callback( getTimer("time_out_post2").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post2", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("example_year_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_year_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_year_post2")
                                                      .remove()
                                                      ,  
                                                      getKey("q_example_year_post")
                                                      .remove()
                                                      ,
                                                      newText ("instructions_example_fact_post", "Hat die Person damit zu tun?<p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_fact_post", "<br>" + variable.fact)
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .print()                                                    
                                                      ,
                                                      //F-Version:
                                                      newText ("instructions_example_fact_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      //newText ("instructions_example_fact_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")  
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()  
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTimer("delay_post4", 500)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_fact_post", "FJ")
                                                      .callback( getTimer("time_out_post3").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post3", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("instructions_example_fact_post")
                                                      .remove()
                                                      ,
                                                      getText("example_fact_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_fact_post2")
                                                      .remove()
                                                      ,
                                                      getKey("q_example_fact_post")
                                                      .remove()                                                          
                                                      ,
                                                      newText ("instructions_example_name_post","Die Person auf dem Bild hei&szlig;t...<p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newText("example_name_post","<br>"+  variable.name)
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .print()
                                                      ,
                                                      //F-Version:
                                                      newText ("instructions_example_name_post2", "<br><p><b>links = 'Ja' / rechts = 'Nein'</b><p>")  
                                                      //J-Version:
                                                      //newText ("instructions_example_name_post2", "<br><p><b>links = 'Nein' / rechts = 'Ja'</b><p>")
                                                      .settings.css("font-size", "20px")
                                                      .settings.center()
                                                      .settings.color("red")
                                                      .print()
                                                      ,
                                                      newTimer("delay_post5", 500)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      newKey("q_example_name_post", "FJ")
                                                      .callback( getTimer("time_out_post4").stop() )
                                                      .log("all")  
                                                      ,
                                                      newTimer("time_out_post4", 5000)
                                                      .start()
                                                      .log()
                                                      .wait()
                                                      ,
                                                      getText("example_name_post")
                                                      .remove()
                                                      ,
                                                      getText("instructions_example_name_post")
                                                      .remove()
                                                      ,
                                                      getText ("instructions_example_name_post2")
                                                      .remove()
                                                      ,
                                                      getKey("q_example_name_post")
                                                      .remove()
                                                      //,
                                                      //newText ("instructions_continue_post", "<p>Dr&uuml;cken Sie bitte die <b>Leertaste</b>, um weiter fortzufahren.<p>")  
                                                      // .settings.css("font-size", "20px")
                                                      //.settings.center()  
                                                      //.settings.color("red")                                                        
                                                      //.print()
                                                      // ,
                                                      // newKey("continue_post" ," ")
                                                      //.print()
                                                      //.wait()
                                                      //,
                                                      // getText("instructions_continue_post")
                                                      // .remove()
                                                      // ,  
                                                      //  getKey("continue_post")
                                                      // .remove()
                                                      
                                                      ,
                                                      newText("pleasewait_post2", "...")
                                                      .settings.css("font-size", "25px")
                                                      .settings.center()
                                                      .settings.bold()
                                                      .print()
                                                      ,
                                                      newTimer("wait_post2", 1000)
                                                      .start()
                                                      .wait()
                                                      ,
                                                      getText("pleasewait_post2")
                                                      .remove() 
                                                     )
                          
                          .log("clickworkerID", getVar("cwID"))                         
                          .log("age", getVar("IDage"))
                          .log("sex", getVar("IDsex"))
                          .log("L2", getVar("IDling"))
                          .log("whichL2", getVar("IDund zwar"))
                          .log( "yes_key" , getVar("yes_key"))
                          .log( "item" , variable.item )
                          .log( "type" , variable.type )              
                          .log( "version" , variable.version)
                          .log( "letter" , variable.letter)
                          
                          .log( "sentence" , variable.sentence)
                          .log( "name" , variable.name)
                          .log( "real_name" , variable.real_name)
                          .log( "wrong_name" , variable.wrong_name)
                          .log( "name_match" , variable.name_match)  
                          .log( "year" , variable.year)
                          .log( "fact" , variable.fact)
                          .log( "photo" , variable.file_name)
                          .log( "full_sentence" , variable.full_sentence)
                          .log( "condition" , variable.condition)
                          
                          .log( "life_mismatch" , variable.life_mismatch)
                          .log( "fact_mismatch" , variable.fact_mismatch)
                          .log( "year_time" , variable.year_time)
                          .log( "fact_time" , variable.fact_time)
                          .log( "year_fact" , variable.year_fact)
                          .log( "list" , variable.list)
                          .log( "life_status" , variable.life_status)
                          .log( "occupation" , variable.occupation)
                          .log( "notice", "post_task")
                          .log( "about", "post_task")
                          
                          .log( "easyhard", "post_task")
                          .log( "strategy", "post_task")
                          .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
                         );  

//====================================================================================================================================================================================================================
// 12. End

PennController( "end_post_task2",
                newText("<p><br>")
                .print()
                ,
                newButton("end_experiment" ,"Verst&auml;ndnistest beenden")
                .settings.center()
                .print()
                .wait()
                ,
                getButton("end_experiment")
                .remove()
               )
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "end" )
    .log( "type" , "end" )              
    .log( "version" , "end")
    .log( "letter" , "end")
    
    .log( "sentence" , "end")
    .log( "name" , "end")
    .log( "real_name" , "end")
    .log( "wrong_name" , "end")
    .log( "name_match" , "end")  
    .log( "year" , "end")
    .log( "fact" , "end")
    .log( "photo" , "end")
    .log( "full_sentence" , "end")
    .log( "condition" , "end")
    
    .log( "life_mismatch" , "end")
    .log( "fact_mismatch" , "end")
    .log( "year_time" , "end")
    .log( "fact_time" , "end")
    .log( "year_fact" , "end")
    .log( "list" , "end")
    .log( "life_status" , "end")
    .log( "occupation" , "end")
    .log( "notice", "end")
    .log( "about", "end")
    
    .log( "easyhard", "end")
    .log( "strategy", "end")
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
//13. Post-experiment questionnaire

PennController("post-ques",
               newText("post-instruc", "Bitte beantworten Sie nun noch folgende Fragen.<p>")
               .settings.bold()
               .print()
               ,
               // Q1
               newText("notice", "<p>1. Ist  Ihnen  w&auml;hrend  der  Studie  etwas  aufgefallen? Irgendwelche  Muster, Regelm&auml;&szlig;igkeiten, etwas &Uuml;berraschendes, oder Seltsames?<p>")
               .print()
               ,
               newTextInput("notice","")
               .size(600,50)
               .print()
               .log()
               ,
               newText("blank", "<p>")
               .print()
               ,
               newButton("next1", "N&auml;chste Frage")
               .print()
               .wait()
               ,
               getButton("next1")
               .remove()
               ,
               // Q2
               newText("about", "<p>2. Was hat das Experiment Ihrer Meinung nach untersucht?<p>")
               .print()
               ,
               newTextInput("about","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next2", "N&auml;chste Frage")
               .print()
               .wait()
               ,
               getButton("next2")
               .remove()
               ,
               //Q3
               newText("easyhard", "<p>3. Welche Teile des Experiments fanden Sie besonders schwierig oder leicht?<p>")
               .print()
               ,
               newTextInput("easyhard","")
               .size(600, 50)
               .print()
               .log()
               ,     
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next3", "N&auml;chste Frage")
               .print()
               .wait()
               ,
               getButton("next3")
               .remove()
               ,
               // Q4
               newText("strategy", "<p>4. Welche Strategien – falls zutreffend – haben Sie w&auml;hrend des Experiments verwendet (ggf. Details nach Teilaufgaben)?<p>")
               .print()
               ,
               newTextInput("strategy","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,              
               newButton("next4", "Experiment beenden")
               .print()
               .wait()
               ,
               // create Vars
               newVar("notice") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("notice") )
               ,
               newVar("about") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("about") )
               ,
               newVar("easyhard") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("easyhard") )
               ,
               newVar("strategy") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("strategy") )
              )
    .log("clickworkerID", getVar("cwID"))
    .log( "age", getVar("IDage"))
    .log( "sex", getVar("IDsex"))
    .log( "L2", getVar("IDling"))
    .log( "whichL2", getVar("IDund zwar"))
    .log( "yes_key" , getVar("yes_key"))
    .log( "item" , "questionnaire" )
    .log( "type" , "questionnaire" )              
    .log( "version" , "questionnaire")
    .log( "letter" , "questionnaire")
    
    .log( "sentence" , "questionnaire")
    .log( "name" , "questionnaire")
    .log( "real_name" , "questionnaire")
    .log( "wrong_name" , "questionnaire")
    .log( "name_match" , "questionnaire")  
    .log( "year" , "questionnaire")
    .log( "fact" , "questionnaire")
    .log( "photo" , "questionnaire")
    .log( "full_sentence" , "questionnaire")
    .log( "condition" , "questionnaire")
    
    .log( "life_mismatch" , "questionnaire")
    .log( "fact_mismatch" , "questionnaire")
    .log( "year_time" , "questionnaire")
    .log( "fact_time" , "questionnaire")
    .log( "year_fact" , "questionnaire")
    .log( "list" , "questionnaire")
    .log( "life_status" , "questionnaire")
    .log( "occupation" , "questionnaire")
    .log( "notice", getVar("notice"))
    .log( "about", getVar("about"))
    
    .log( "easyhard", getVar("easyhard"))
    .log( "strategy", getVar("strategy"))
    .log( "withsquare", PennController.GetURLParameter("withsquare") )
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 14. Send results

PennController.SendResults( "send" )
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 15. Good-bye

PennController.Template(PennController.GetTable( "validation-SPR.csv"),// change this line for the appropriate experimental list  
                        variable => PennController( "final"
                                                    ,
                                                    // F-Version: 
                                                    newText("<p>Vielen Dank f&uuml;r Ihre Teilnahme an unserem Experiment!<p><br><b>Hier ist Ihr Validierungscode: "+variable.val_code+".</b><p><br>Bitte geben Sie diesen Code auf der Prolific-Webseite ein, um Ihre Bezahlung zu erhalten.</p>")
                                                    // J-Version: 
                                                    //newText("<p>Vielen Dank f&uuml;r Ihre Teilnahme an unserem Experiment!<p><br><b>Hier ist Ihr Validierungscode: "+variable.val_code+"J.</b><p><br>Bitte geben Sie diesen Code auf der Prolific-Webseite ein, um Ihre Bezahlung zu erhalten.</p>")
                                                    .settings.css("font-size", "20px")
                                                    .settings.center()
                                                    .print()
                                                    ,
                                                    newButton("void")
                                                    .wait()
                                                   )
                        
                        .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
                        .setOption("hideProgressBar", true)
                       );


