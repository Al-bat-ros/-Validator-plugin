class Validator {
    constructor({selector, pattern = {}, method}){
        this.form = document.querySelector(selector);//
        this.pattern = pattern;// кастомные шаблоны
        this.method = method;// настройки
        this.elementsForm = [...this.form.elements].filter(item => {
            return item.tagName.toLowerCase() !== 'button' &&
            item.type !== 'button';
        });
        this.error = new Set();
    }
    init(){
        console.log(this.form);
        this.applyStyle();
        this.setPattern();
        console.log(this.elementsForm);
        this.elementsForm.forEach(elem => elem.addEventListener('change', this.chekIt.bind(this)));

        this.form.addEventListener('submit', e => {
            console.log(e);
            e.preventDefault();
            
            this.elementsForm.forEach(elem => this.chekIt({target: elem}));
           
            if(this.error.size){
                e.preventDefault();
            }
        })
    }

    //здесь проходит волидация
    isValid(elem){
       
        const validatorMethod = {
            notEmpty(elem){
                if(elem.value.trim() === ''){
                    return false;
                }
                return true;
            },
            pattern(elem, pattern){
                
                return pattern.test(elem.value);
            }
        };
        if(this.method){
            const method = this.method[elem.id];

            if(method){
               return method.every( item => validatorMethod[item[0]](elem, this.pattern[item[1]]));
            }
        }else{
            console.warn('Необходимо предать id полей ввода и методы проверки этих полей!')
        }
      
       return true;
    }

    //определяет прошел валидацию или нет
    chekIt(event){
        const target = event.target; 
       if(this.isValid(target)){ 
        console.log(target);
           this.showSuccess(target); 
           this.error.delete(target);  
       }else{
        console.log(target);
        this.showError(target);
        this.error.add(target);
       }
    }

    //Сообщает если наш инпут непрошол валидацию
    showError(elem){
        elem.classList.remove('success');
        elem.classList.add('error');
        if (elem.nextElementSibling && elem.nextElementSibling.classList.contains('validator-error')){
            return;
        }
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Ошибка в этом поле';
        errorDiv.classList.add('validator-error');
        elem.insertAdjacentElement('afterend', errorDiv);
    }

    //Валидация прошла успешно
    showSuccess(elem){
        elem.classList.remove('error');
        elem.classList.add('success');
        if (elem.nextElementSibling && elem.nextElementSibling.classList.contains('validator-error')){
            elem.nextElementSibling.remove();
        }
    }

    applyStyle(){
        const style = document.createElement('style');
        style.textContent = `
        input.success{
            border: 2px solid green
        }
        input.error {
            border: 2px solid red
        }
        .validator-error {
            font-size: 12px;
            font-family: sans-serif;
            color: red
        }
        `;
        document.head.appendChild(style);
    }
    setPattern(){
        if(!this.pattern.phone){
            this.pattern.phone = /^\+?[78]([-()]*\d){10}$/;
            // this.pattern.phone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
        }
        if(!this.pattern.email){
            this.pattern.email = /^\w+@\w+\.\w{2,}/;
        }
    }  
}