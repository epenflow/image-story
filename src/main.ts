import './style.css';
import { stories } from './data';

let activeStroy = 0;
const storyDuration = 4000;
const contentUpdateDelay = 0.4;
let direction = 'next';
let storyTimeout: number;
import { gsap } from 'gsap';
const cursor = document.querySelector('.cursor');
// const cursorText = cursor?.querySelector('p');
const indices = document.querySelector('.indices');
stories.forEach(() => {
	const newIndexDiv = document.createElement('div');
	newIndexDiv.className = 'index';
	const newIndexHighlight = document.createElement('div');
	newIndexHighlight.className = 'index-highlight';
	newIndexDiv.appendChild(newIndexHighlight);
	indices?.appendChild(newIndexDiv);
});
function changeStory() {
	const previousStory = activeStroy;
	if (direction === 'next') {
		activeStroy = (activeStroy + 1) % stories.length;
	} else {
		activeStroy = (activeStroy - 1 + stories.length) % stories.length;
	}

	const story = stories[activeStroy];
	gsap.to('.profile-name p', {
		y: direction === 'next' ? -24 : 24,
		duration: 0.5,
		delay: contentUpdateDelay,
	});
	gsap.to('.title-row h1', {
		y: direction === 'next' ? -48 : 48,
		duration: 0.5,
		delay: contentUpdateDelay,
	});
	const currentImgContainer = document.querySelector('.story-img .img');
	const currentImg = currentImgContainer?.querySelector('img');

	setTimeout(() => {
		const newProfileName = document.createElement('p');
		newProfileName.innerHTML = story.profileName;
		newProfileName.style.transform =
			direction === 'next' ? 'translateY(24px)' : 'translateY(-24px)';
		const profileNameDiv = document.querySelector('.profile-name');
		profileNameDiv?.appendChild(newProfileName);
		gsap.to(newProfileName, {
			y: 0,
			duration: 0.5,
			delay: contentUpdateDelay,
		});
		const titleRows = document.querySelectorAll('.title-row');
		story.title.forEach((line, index) => {
			if (titleRows[index]) {
				const newTitle = document.createElement('h1');
				(newTitle.innerText = line),
					(newTitle.style.transform =
						direction === 'next'
							? 'translateY(48px)'
							: 'translateY(-48px)');
				titleRows[index].appendChild(newTitle);
				gsap.to(newTitle, {
					y: 0,
					duration: 0.5,
					delay: contentUpdateDelay,
				});
			}
		});
		const newImgContainer = document.createElement('div');
		newImgContainer.classList.add('img');
		const newStoryImg = document.createElement('img');
		(newStoryImg.src = story.storyImg),
			(newStoryImg.alt = story.profileName);
		newImgContainer.appendChild(newStoryImg);
		const storyImgDiv = document.querySelector('.story-img');
		storyImgDiv?.appendChild(newImgContainer);
		animateNewImage(newImgContainer);
		const upcomingImg = newStoryImg;
		animateImageScale(currentImg, upcomingImg);
		resetIndexHightLight(previousStory);
		animateIndexHighlight(activeStroy);

		clearUpElements();
		clearTimeout(storyTimeout);
		storyTimeout = setTimeout(changeStory, storyDuration);
	}, 200);
	setTimeout(() => {
		const profileImg = document.querySelector(
			'.profile-icon img',
		) as HTMLImageElement;
		profileImg.src = story.profileImg;
		const link = document.querySelector('.link a') as HTMLAnchorElement;
		link!.textContent = story.linkLabel;
		link!.href = story.linkLabel;
	}, 600);
}
function animateNewImage(imgContainer: HTMLDivElement) {
	gsap.set(imgContainer, {
		clipPath:
			direction === 'next'
				? 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
				: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
	});
	gsap.to(imgContainer, {
		clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
		duration: 1,
		ease: 'power4.inOut',
	});
}
function animateImageScale(
	currentImg: HTMLImageElement | null | undefined,
	upcomingImg: HTMLImageElement,
) {
	if (currentImg)
		gsap.fromTo(
			currentImg,
			{
				scale: 1,
				rotate: 0,
			},
			{
				scale: 2,
				rotate: direction === 'next' ? -25 : 25,
				duration: 1,
				ease: 'power4.inOut',
				onComplete: () => currentImg.parentElement?.remove(),
			},
		);
	gsap.fromTo(
		upcomingImg,
		{
			scale: 2,
			rotate: direction === 'next' ? 25 : -25,
		},
		{
			scale: 1,
			rotate: 0,
			duration: 1,
			ease: 'power4.inOut',
		},
	);
}

function resetIndexHightLight(index: number) {
	const highlight = document.querySelectorAll('.index .index-highlight')[
		index
	];
	gsap.killTweensOf(highlight);
	gsap.to(highlight, {
		width: direction === 'next' ? '100%' : '0%',
		duration: 0.3,
		onStart: () => {
			gsap.to(highlight, {
				transformOrigin: 'right center',
				scaleX: 0,
				duration: 0.3,
			});
		},
	});
}
function animateIndexHighlight(index: number) {
	const highlight = document.querySelectorAll('.index .index-highlight')[
		index
	];
	gsap.set(highlight, {
		width: '0%',
		scaleX: 1,
		transformOrigin: 'right center',
	});
	gsap.to(highlight, {
		width: '100%',
		duration: storyDuration / 1000,
		ease: 'none',
	});
}

function clearUpElements() {
	const profileNameDiv = document.querySelector('.profile-name');
	const titleRows = document.querySelectorAll('.title-row');
	if (profileNameDiv)
		while (profileNameDiv?.childElementCount > 2) {
			if (profileNameDiv.firstChild)
				profileNameDiv?.removeChild(profileNameDiv.firstChild);
		}
	titleRows.forEach((titleRow) => {
		while (titleRow.childElementCount > 2) {
			if (titleRow.firstChild) titleRow.removeChild(titleRow.firstChild);
		}
	});
}
document.addEventListener('mousemove', (event) => {
	const { clientX, clientY } = event;
	gsap.to(cursor, {
		x: clientX,
		y: clientY,
		ease: 'power2.out',
		duration: 0.3,
	});
	const viewportWidth = window.innerWidth;

	if (clientX < viewportWidth / 2) {
		cursor!.textContent = 'Prev';
		direction = 'prev';
	} else {
		cursor!.textContent = 'Next';
		direction = 'next';
	}
});

document.addEventListener('click', () => {
	clearTimeout(storyTimeout);
	resetIndexHightLight(activeStroy);
	changeStory();
});
storyTimeout = setTimeout(changeStory, storyDuration);
animateIndexHighlight(activeStroy);
