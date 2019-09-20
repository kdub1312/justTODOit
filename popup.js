// Copyright 2019 Kevin Wagner. All rights reserved..

'use strict';

let addTask = document.getElementById('addTask');
let taskList = document.getElementById('taskList');
let taskInput = document.getElementById('taskInput');
taskInput.focus();

//ACCESS ARRAY ASSIGNED TO OBJECT OF SYNC, 'TASKS'
chrome.storage.sync.get(['tasks'], function(data) {
    for (var i = 0; i < data.tasks.length; i++) {
        console.log(data.tasks[i]);
        var firstTask = data.tasks[i];
        var task = document.createElement("li");
        
        //add checkbox input to each line
        var checkboxInput = document.createElement("input");
        checkboxInput.setAttribute("type", "checkbox");
        task.appendChild(checkboxInput);
        
        //add text to each line
        var label = document.createElement("label");
        var textWrapper = document.createElement("span");
        textWrapper.classList.add('task-text');
        label.appendChild(textWrapper);
        task.appendChild(label);
        textWrapper.textContent = firstTask;
        
        //add delete button to each item
        var deleteButton = document.createElement("button");
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        task.appendChild(deleteButton);
        
        
        taskList.appendChild(task);
        taskInput.focus();
    }
});

addTask.onclick = function(element) {
    //add item to 'tasks' array then output to list
    var newTask = taskInput.value;//to save checkbox value consider assigning array to newTask
    taskInput.value = '';
    
    chrome.storage.sync.get('tasks', function(obj) {
        var tasks = obj.hasOwnProperty('tasks') ? obj.tasks : [];
        tasks.push(newTask);
        chrome.storage.sync.set({'tasks': tasks}, function() {
            if (chrome.runtime.lastError)
                console.log(chrome.runtime.lastError);
            else
                console.log("Tasks saved successfully");
        });
        
        //set new list item
        var task = document.createElement("li");
        var index = tasks.length - 1;
        task.classList.add('task-' + index);//create indexed class name
        
        //add checkbox input to each line
        var checkboxInput = document.createElement("input");
        checkboxInput.setAttribute("type", "checkbox");
        task.appendChild(checkboxInput);
        
        //add text to each line
        var label = document.createElement("label");
        var textWrapper = document.createElement("span");
        textWrapper.classList.add('task-text');
        label.appendChild(textWrapper);
        task.appendChild(label);
        textWrapper.textContent = tasks[index];
        
        var deleteButton = document.createElement("button");
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        task.appendChild(deleteButton);
        
        taskList.appendChild(task);
        //move focus back to input element
        taskInput.focus();
        
    });

  };

//respond to user pressing 'enter' during focus of 'add task' button
addTask.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    addTask.click();
  }
});

//Create distributed event listener on ul
taskList.addEventListener('click', function(e) {
    if(e.target && e.target.className == 'delete-button') {
        
        //gather all the list items from the dom
        var allListItems = document.querySelectorAll('#taskList li');
        //cycle thru each list item
        for(var i = 0; i < allListItems.length; i++) {
            //assemble class name, which is index-based
            var currentClass = 'task-' + i;
            
            //if the li parent of this delete button contains the class name, enter code block
            if(e.target.parentNode.classList.contains(currentClass)) {
                //grab the current li we're working with
                var currentLi = e.target.parentNode;
                //cache text value of li before deleting, for later use in reindexing db
                var liValue = e.target.parentNode.childNodes[0].textContent;
                //go ahead and remove the li from the dom
                e.target.parentNode.parentNode.removeChild(currentLi);
                
                //query storage and grab tasks array
                chrome.storage.sync.get('tasks', function(obj) {
                    
                    //sorcery to assign tasks array to variable
                    var tasks = obj.hasOwnProperty('tasks') ? obj.tasks : [];
                    //remove all tasks from storage
                    chrome.storage.sync.remove('tasks');
                    //find and remove deleted task from array, checking against cached li text value
                    //liValue is cached textnode value prior to dom deletion
                    for(var j = 0; j < tasks.length; j++) {
                        if(tasks[j] == liValue) {
                            tasks.splice(j, 1);
                        }
                    }
                    //reset tasks in storage
                    chrome.storage.sync.set({'tasks': tasks}, function() {
                        if (chrome.runtime.lastError)
                            console.log(chrome.runtime.lastError);
                        else
                            console.log("Tasks saved successfully");
                    });

                });
                
                
            }
         
            
        }
        
        var remainingItems = document.querySelectorAll('#taskList li');
        for(var i = 0; i < remainingItems.length; i++) {
            remainingItems[i].className = '';
            remainingItems[i].classList.add('task-' + i);//BOOMSHAKALAKA!! 
        }
        
    }
})