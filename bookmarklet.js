javascript:(function () {
    console.log("
	JS Bookmarklet for Brutalist.report
	\n
	The day's headlines delivered to you without bullshit.
	\n
	Now with even less bullshit!
	\n
	Details at https://github.com/kmfd/brutalist-report-css/
	\n
	GPL-3.0 license");
	const stylesheets = document.styleSheets;
    const orders = {};
    for (let i = 0; i < stylesheets.length; i++) {
        const stylesheet = stylesheets[i];
        const rules = stylesheet.cssRules;
        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            const cssText = rule.cssText;
            if (cssText.includes('.brutal-grid') && cssText.includes('order:')) {
                console.log('Target Stylesheet:');
                console.log(cssText);
                const hrefRegex = /href\*="([^"]+)"/;
                const orderRegex = /order: (\d+);/;
                const hrefMatch = cssText.match(hrefRegex);
                const orderMatch = cssText.match(orderRegex);
                if (hrefMatch && orderMatch) {
                    const href = hrefMatch[1];
                    const order = parseInt(orderMatch[1]);
                    orders[href] = order;
                }
            }
        }
    }
    const sourceSelector = '.brutal-grid > div:has(h3 a[href*="/source/"])';
    const sources = document.querySelectorAll(sourceSelector);
    const sourceList = Array.prototype.slice.call(sources).map((source) => {
        const name = source.querySelector('h3').textContent;
        let href = source.querySelector('h3 a').href;
        href = '/' + href.split('/').slice(-2).join('/');
        return {
            name,
            href,
            enabled: orders[href]!== undefined
        };
    });
    if (Object.keys(orders).length === 0) {
        sourceList.forEach((source) => {
            source.enabled = true;
        });
    } else {
        sourceList.sort((a, b) => {
            const orderA = orders[a.href] || Infinity;
            const orderB = orders[b.href] || Infinity;
            return orderA - orderB;
        });
    }
	
	const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        /* dummy style block */
			.lists-container {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 600px;
		}

		.list-container {
			width: 300px;
			font-size: 20px;
			background: #333;
			display: flex;
			flex-direction: row;
		}

		.list {
			width: 100%;
			flex-grow: 1;
		}

		.list-item {
			border-radius: 5px;
			border: 1px solid #666;
			margin-bottom: 1px;
			padding: 10px;
			background: #444;
			display: flex;
			align-items: center;
		}

		.drag-handle {
			width: 20px;
			height: 20px;
			cursor: move;
			background: #666;
			border-radius: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.caret-container {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.up-caret {
			width: 0;
			height: 0;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			border-bottom: 5px solid #fff;
			margin-left: -4px;
		}

		.down-caret {
			width: 0;
			height: 0;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			border-top: 5px solid #fff;
			margin-left: 4px;
		}

		.checkbox-cell {
			width: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.checkbox {
			background: #444;
			border: 1px solid #666;
		}

		.label-cell {
			width: 200px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.label {
			color: #fff;
		}

		.button-container {
			display: flex;
			justify-content: space-between;
			width: 300px;
		}

		.button {
			background: #333;
			color: #fff;
			border: none;
			padding: 10px;
			font-size: 16px;
			cursor: pointer;
		}

		.button:hover {
			background: #444;
		}

		.code-block {
			background: #333;
			padding: 10px;
			border-radius: 5px;
		}

		.container {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
    `;
    document.head.appendChild(style);
	
    const listsContainer = document.createElement('div');
    listsContainer.classList.add('lists-container');
    document.body.appendChild(listsContainer);

    const checkedListContainer = document.createElement('div');
    checkedListContainer.classList.add('list-container');
    const uncheckedListContainer = document.createElement('div');
    uncheckedListContainer.classList.add('list-container');

    const checkedList = document.createElement('div');
    checkedList.id = 'checked-list';
    checkedList.classList.add('list');
    const uncheckedList = document.createElement('div');
    uncheckedList.id = 'unchecked-list';
    uncheckedList.classList.add('list');

    checkedListContainer.appendChild(checkedList);
    uncheckedListContainer.appendChild(uncheckedList);

    listsContainer.appendChild(checkedListContainer);
    listsContainer.appendChild(uncheckedListContainer);

    sourceList.forEach((source, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');
        listItem.draggable = true;
        listItem.dataset.index = index;
        const dragHandle = document.createElement('div');
        dragHandle.classList.add('drag-handle');
        const checkboxCell = document.createElement('div');
        checkboxCell.classList.add('checkbox-cell');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = source.enabled;
        checkbox.id = `source-${index}`;
        checkbox.classList.add('checkbox');
        checkboxCell.appendChild(checkbox);
        const labelCell = document.createElement('div');
        labelCell.classList.add('label-cell');
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = source.name;
        label.classList.add('label');
        labelCell.appendChild(label);
        listItem.appendChild(dragHandle);
        listItem.appendChild(checkboxCell);
        listItem.appendChild(labelCell);
        if (source.enabled) {
            checkedList.appendChild(listItem);
        } else {
            uncheckedList.appendChild(listItem);
        }
    });

    checkedList.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.closest('div[draggable]').dataset.index);
		console.log(e.target.closest('div[draggable]').dataset.index);
    });
    uncheckedList.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.closest('div[draggable]').dataset.index);
    });
    checkedList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    uncheckedList.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
	
	checkedList.addEventListener('drop', (e) => {
	  const draggedIndex = parseInt(e.dataTransfer.getData('text'));
	  const draggableElements = checkedList.querySelectorAll('div[draggable]');
	  const targetIndex = parseInt(e.target.closest('div[draggable]')?.dataset.index ?? (draggableElements.length + 1 > 0 ? draggableElements.length : 0));
	  console.log(e.target.closest('div[draggable]')?.dataset.index ?? (draggableElements.length > 0 ? draggableElements.length : 0));
	  if (draggedIndex !== targetIndex) {
		const item = sourceList[draggedIndex];
		sourceList.splice(draggedIndex, 1);
		sourceList.splice(targetIndex, 0, item);
		item.enabled = true;
		updateLists();
	  } else {
		const item = sourceList[draggedIndex];
		sourceList.splice(draggedIndex, 1);
		sourceList.splice(targetIndex, 0, item);
		item.enabled = true;
		updateLists();
	  }
	});

    uncheckedList.addEventListener('drop', (e) => {
        const draggedIndex = parseInt(e.dataTransfer.getData('text'));
		const draggableElements = listsContainer.querySelectorAll('div[draggable]');
		const targetIndex = parseInt(e.target.closest('div[draggable]')?.dataset.index ?? (draggableElements.length > 0 ? draggableElements.length : 0));
		console.log(e.target.closest('div[draggable]')?.dataset.index ?? (draggableElements.length > 0 ? draggableElements.length : 0));
        if (draggedIndex!== targetIndex) {
            const item = sourceList[draggedIndex];
            sourceList.splice(draggedIndex, 1);
            sourceList.splice(targetIndex - 1, 0, item);
            item.enabled = false;
            updateLists();
        }
    });
    checkedList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.id.split('-')[1]);
            sourceList[index].enabled = e.target.checked;
            updateLists();
        }
    });
    uncheckedList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const index = parseInt(e.target.id.split('-')[1]);
            sourceList[index].enabled = e.target.checked;
            updateLists();
        }
    });
    function updateLists() {
        checkedList.innerHTML = '';
        uncheckedList.innerHTML = '';
        sourceList.forEach((source, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');
            listItem.draggable = true;
            listItem.dataset.index = index;
            const dragHandle = document.createElement('div');
            dragHandle.classList.add('drag-handle');
            const checkboxCell = document.createElement('div');
            checkboxCell.classList.add('checkbox-cell');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = source.enabled;
            checkbox.id = `source-${index}`;
            checkbox.classList.add('checkbox');
            checkboxCell.appendChild(checkbox);
            const labelCell = document.createElement('div');
            labelCell.classList.add('label-cell');
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = source.name;
            label.classList.add('label');
            labelCell.appendChild(label);
            listItem.appendChild(dragHandle);
            listItem.appendChild(checkboxCell);
            listItem.appendChild(labelCell);
            if (source.enabled) {
                checkedList.appendChild(listItem);
            } else {
                uncheckedList.appendChild(listItem);
            }
        });
    }
    let generationCount = 0;
    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate CSS';
    generateButton.classList.add('button');
    generateButton.onclick = () => {
        generationCount++;
        const enabledSources = sourceList.filter((source) => source.enabled);
        const css = generateCss(enabledSources);
        const codeBlock = document.createElement('pre');
        codeBlock.classList.add('code-block');
        const code = document.createElement('code');
        code.textContent = css;
        codeBlock.appendChild(code);
        const note = document.createElement('p');
        note.textContent = 'Copy this CSS to your preferred style editor like Stylus.';
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.classList.add('button');
        copyButton.onclick = () => {
            navigator.clipboard.writeText(css);
        };
        const container = document.createElement('div');
        container.classList.add('container');
        container.appendChild(codeBlock);
        container.appendChild(note);
        container.appendChild(copyButton);
        document.body.appendChild(container);
        document.body.appendChild(buttonContainer);
    };
    const applyButton = document.createElement('button');
    applyButton.textContent = 'Apply CSS';
    applyButton.classList.add('button');
    applyButton.onclick = () => {
		const enabledSources = sourceList.filter((source) => source.enabled);
		const css = generateCss(enabledSources);
		const existingStyles = document.head.querySelectorAll('.dynamic-style');
		existingStyles.forEach((style) => style.remove());
		const style = document.createElement('style');
		style.type = 'text/css';
		style.className = 'dynamic-style';
		style.innerHTML = css;
		document.head.appendChild(style);
    };
    const selectAllButton = document.createElement('button');
    selectAllButton.textContent = 'Select All';
    selectAllButton.classList.add('button');
    selectAllButton.onclick = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
        sourceList.forEach((source) => {
            source.enabled = true;
        });
        updateLists();
    };
    const deselectAllButton = document.createElement('button');
    deselectAllButton.textContent = 'Deselect All';
    deselectAllButton.classList.add('button');
    deselectAllButton.onclick = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
			checkbox.checked = false;
        });
        sourceList.forEach((source) => {
            source.enabled = false;
        });
        updateLists();
    };
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.appendChild(generateButton);
    buttonContainer.appendChild(applyButton);
    buttonContainer.appendChild(selectAllButton);
    buttonContainer.appendChild(deselectAllButton);
    document.body.appendChild(buttonContainer);

    function getOrdersFromCss(css) {
        const orderRegex = /\.brutal-grid > div:has$h3 a$href\*="([^"]+)"$ { order: (\d+); }/g;
        const orders = {};
        let match;
        while ((match = orderRegex.exec(css))!== null) {
            const href = match[1];
            const order = parseInt(match[2]);
            orders[href] = order;
        }
        return orders;
    }

    function generateCss(sources) {
        let css = '';
        css += '.brutal-grid > div { display: none; }\n';
        css += '.brutal-grid > div:has(' + sources.map(source => `h3 a[href*="${source.href.toLowerCase()}"]`).join(',\n') + ') {\n';
        css +='display: grid;\n';
        css += '}\n';
        sources.forEach((source, index) => {
            const order = (index + 1) * 10;
            css += `.brutal-grid > div:has(h3 a[href*="${source.href.toLowerCase()}"]) { order: ${order}; }\n`;
        });
        css += '.brutal-grid {\n';
        css +='align-items: start;\n';
        css += '}\n';
        css += 'li {\n';
        css +='padding-bottom: 0.3rem;\n';
        css += '}\n';
        return css;
    }
})();