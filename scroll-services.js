(function($) {
	"use strict";
	var menuBreakPoint = 991;
	var sliderBreakPoint = 991;
	var animeBreakPoint = 1199;
	var headerTransition = 300;
	var isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	if (isTouchDevice) {
		$('body').addClass('is-touchable');
	}
	var lastScroll = 0,
		simpleDropdown = 0,
		linkDropdown = 0,
		isotopeObjs = [],
		swiperObjs = [];
	var windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
	var isMobile = false,
		isiPhoneiPad = false,
		isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		isMobile = true;
	}
	if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		isiPhoneiPad = true;
	}
	function getHeaderHeight() {
		var headerHeight = 0;
		if ($('.header-top-bar').length) {
			headerHeight = headerHeight + $('.header-top-bar').outerHeight();
		}
		if ($('header nav.navbar').length) {
			headerHeight = headerHeight + $('header nav.navbar').outerHeight();
		}
		if ($('.left-modern-header .left-modern-sidebar').length) {
			headerHeight = headerHeight + $('.left-modern-header .left-modern-sidebar').outerHeight();
		}
		return headerHeight;
	}




	const ThreeDLetterMenuEffect = () => {
		$(".threeD-letter-menu .menu-item").each(function() {
			let _self = this,
				MenuLink = _self.querySelector(".menu-item-text"),
				MenuText = MenuLink.querySelector("span"),
				imgHeight = _self.querySelector(".hover-reveal").clientHeight,
				imgWidth = _self.querySelector(".hover-reveal").clientWidth,
				windowHeight = window.innerHeight,
				windowWidth = window.innerWidth;
			MenuLink.innerHTML = `<span>${MenuText.innerHTML}</span><span class="clone">${MenuText.innerHTML}</span>`
			MenuLink.querySelectorAll("span").forEach(function(item) {
				item.setAttribute("data-splitting", true);
				Splitting();
			});
			_self.addEventListener("mouseenter", function() {
				anime({
					targets: _self.querySelector(".hover-reveal"),
					opacity: [0, 1],
					duration: 1000,
					easing: "easeOutQuad"
				})
				anime({
					targets: _self.querySelector(".hover-reveal__inner"),
					scale: [0.5, 1],
					easing: "easeOutQuad"
				})
				anime({
					targets: _self.querySelector(".hover-reveal__img"),
					scale: [2, 1],
					easing: "easeOutQuad"
				})
			})
			_self.addEventListener("mouseleave", function() {
				anime({
					targets: _self.querySelector(".hover-reveal"),
					opacity: 0,
					duration: 1000,
					easing: "easeOutQuad"
				})
				anime({
					targets: _self.querySelector(".hover-reveal__inner"),
					scale: [1, 0.5],
					easing: "easeOutQuad"
				})
				anime({
					targets: _self.querySelector(".hover-reveal__img"),
					scale: [1, 2],
					easing: "easeOutQuad"
				})
			})
			if (typeof TweenLite !== "undefined") {
				document.addEventListener("mousemove", function(e) {
					let posX = e.clientX + 20,
						posY = e.clientY + 20;
					TweenLite.to(_self.querySelector(".hover-reveal"), .6, {
						x: posX + imgWidth > windowWidth ? e.clientX - imgWidth : posX,
						y: posY + imgHeight > windowHeight ? e.clientY - imgHeight : posY,
					})
				})
			}
		});
	}
	ThreeDLetterMenuEffect();

	function animateCounters() {
		$('.counter').each(function(options) {
			var _this = $(this);
			options = $.extend({}, options || {}, _this.data('countToOptions') || {});
			if (typeof $.fn.countTo === 'function') {
				_this.countTo(options);
			}
		});
	}

	function slideboxstyle() {
		$('.sliding-box').each(function(index, value) {
			var valueObj = $(value),
				totalWidth = valueObj.outerWidth(),
				slidingLength = valueObj.find('.sliding-box-item').length,
				devideRightPadding = parseInt(valueObj.css('padding-right')) / slidingLength,
				devideLeftPadding = parseInt(valueObj.css('padding-left')) / slidingLength,
				usageWidth = (slidingLength * 30) + 30 + devideRightPadding + devideLeftPadding,
				useWidth = totalWidth - usageWidth,
				devideLength = slidingLength + 1,
				devideWidth = (useWidth / devideLength),
				activeWidth = devideWidth * 2;
			valueObj.find('.sliding-box-item, .sliding-box-img, .sliding-box-item .sliding-box-content').css('width', devideWidth);
			valueObj.find('.sliding-box-item .sliding-box-content').css('left', devideWidth);
			valueObj.find('.sliding-box-item.active').css('width', activeWidth);
			$(document).on('mouseenter', '.sliding-box .sliding-box-item', function() {
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
				valueObj.find('.sliding-box-item, .sliding-box-img, .sliding-box-item .sliding-box-content').css('width', devideWidth);
				valueObj.find('.sliding-box-item .sliding-box-content').css('left', devideWidth);
				valueObj.find('.sliding-box-item.active').css('width', activeWidth);
			});
		});
	}
	
	
	function setupSwiper() {
		var swipers = document.querySelectorAll('[data-slider-options]:not(.instafeed-wrapper)');
		swipers.forEach(function(swiperItem) {
			var _this = $(swiperItem),
				sliderOptions = _this.attr('data-slider-options');
			if (typeof(sliderOptions) !== 'undefined' && sliderOptions !== null) {
				sliderOptions = $.parseJSON(sliderOptions);
				var changeOnClick = _this.attr('data-slide-change-on-click');
				if (changeOnClick != '' && changeOnClick != undefined && changeOnClick == '1') {
					sliderOptions['on'] = {
						click: function() {
							if (this.activeIndex > this.clickedIndex) {
								this.slidePrev();
							} else if (this.activeIndex < this.clickedIndex) {
								this.slideNext();
							}
						}
					};
				}
				if (sliderOptions['thumbs'] != '' && sliderOptions['thumbs'] != undefined) {
					var mdThumbDirection = _this.attr('data-thumb-slider-md-direction');
					if (mdThumbDirection != '' && mdThumbDirection != undefined) {
						var thumbDirection = (sliderOptions['thumbs']['swiper']['direction'] != '' && sliderOptions['thumbs']['swiper']['direction'] != undefined) ? sliderOptions['thumbs']['swiper']['direction'] : mdThumbDirection;
						sliderOptions['thumbs']['swiper']['on'] = {
							init: function() {
								if (getWindowWidth() <= sliderBreakPoint) {
									this.changeDirection(mdThumbDirection);
								} else {
									this.changeDirection(thumbDirection);
								}
								this.update();
							},
							resize: function() {
								if (getWindowWidth() <= sliderBreakPoint) {
									this.changeDirection(mdThumbDirection);
								} else {
									this.changeDirection(thumbDirection);
								}
								this.update();
							},
							click: function() {
								if (this.activeIndex == this.clickedIndex) {
									this.slidePrev();
								} else {
									this.slideNext();
								}
							}
						};
					}
				}
				var numberPagination = _this.attr('data-number-pagination');
				if (numberPagination != '' && numberPagination != undefined && numberPagination == '1' && sliderOptions['pagination'] != '' && sliderOptions['pagination'] != undefined) {
					sliderOptions['pagination']['renderBullet'] = function(index, className) {
						return '<span class="' + className + '">' + pad(index + 1) + '</span>';
					}
				}
				var dataThumbs = _this.attr('data-thumbs');
				if (dataThumbs != '' && dataThumbs != undefined && sliderOptions['pagination'] != '' && sliderOptions['pagination'] != undefined) {
					dataThumbs = $.parseJSON(dataThumbs);
					if (typeof(dataThumbs) !== 'undefined' && dataThumbs !== null) {
						sliderOptions['pagination']['renderBullet'] = function(index, className) {
							return '<span class="' + className + '" style="background-image: url( ' + dataThumbs[index] + ' )"></span>';
						}
					}
				}
				sliderOptions['on'] = {
					init: function() {
						let slides = this.slides;
						let activeIndex = this.activeIndex,
							current_slide = this.slides[activeIndex],
							anime_el = current_slide.querySelectorAll('[data-anime]'),
							fancy_el = current_slide.querySelectorAll('[data-fancy-text]');
						if (getWindowWidth() > animeBreakPoint) {
							if (anime_el) {
								anime_el.forEach(element => {
									let options = element.getAttribute('data-anime');
									if (typeof(options) !== 'undefined' && options !== null) {
										options = $.parseJSON(options);
										element.classList.add('appear');
										element.style.transition = "none";
										if (options.el) {
											for (let i = 0; i < element.children.length; i++) {
												element.children[i].style.transition = "none";
												element.children[i].classList.add('appear');
											}
										}
										animeAnimation(element, options);
										element.classList.remove('appear');
									}
								});
							}
						}
					},
					slideChange: function() {
						let slides = this.slides;
						let activeIndex = this.activeIndex,
							current_slide = this.slides[activeIndex],
							anime_el = current_slide.querySelectorAll('[data-anime]'),
							fancy_el = current_slide.querySelectorAll('[data-fancy-text]');
						if (getWindowWidth() > animeBreakPoint) {
							if (fancy_el) {
								fancy_el.forEach(element => {
									element.classList.add('appear');
									let fancy_options = element.getAttribute('data-fancy-text');
									if (typeof(fancy_options) !== 'undefined' && fancy_options !== null) {
										fancy_options = $.parseJSON(fancy_options);
										let child = element;
										FancyTextDefault(child, fancy_options);
										element.classList.remove('appear');
									}
								});
							}
							if (anime_el) {
								anime_el.forEach(element => {
									let options = element.getAttribute('data-anime');
									if (typeof(options) !== 'undefined' && options !== null) {
										options = $.parseJSON(options);
										element.classList.add('appear');
										element.style.transition = "none";
										if (options.el) {
											for (let i = 0; i < element.children.length; i++) {
												element.children[i].style.transition = "none";
												element.children[i].classList.add('appear');
											}
										}
										animeAnimation(element, options);
										element.classList.remove('appear');
									}
								});
							}
						}
					}
				};
				var isNumberPagination = _this.attr('data-swiper-number-line-pagination') || false;
				var isNumberNavigation = _this.attr('data-swiper-number-navigation') || false;
				var isNumberPaginationProgress = _this.attr('data-swiper-number-pagination-progress') || false;
				var showProgress = _this.attr('data-swiper-show-progress') || false;
				var hasGalleryBox = _this.attr('data-gallery-box') || false;
				if (isNumberPagination || isNumberNavigation || isNumberPaginationProgress || hasGalleryBox) {
					sliderOptions['on'] = {
						init: function() {
							if (isNumberPagination || isNumberNavigation || isNumberPaginationProgress) {
								if (sliderOptions.hasOwnProperty('loop') && sliderOptions['loop']) {
									var slideLength = this.slides.length;
								}
								var length = slideLength;
								if (isNumberPaginationProgress) {
									_this.parent().find('.number-next').text('0' + length);
									_this.parent().find('.number-prev').text('01');
									_this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', (100 / length).toFixed(2) + '%');
								} else {
									_this.parent().find('.number-next').text('02');
									_this.parent().find('.number-prev').text('0' + length);
									if (showProgress)
										_this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', (100 / length).toFixed(2) + '%');
								}
							}
							if (typeof $.fn.magnificPopup === 'function') {
								if (hasGalleryBox) {
									_this.magnificPopup({
										delegate: 'a',
										type: 'image',
										closeOnContentClick: true,
										closeBtnInside: false,
										gallery: {
											enabled: true
										}
									});
								}
							}
						},
						slideChange: function() {
							if (isNumberPagination || isNumberNavigation || isNumberPaginationProgress) {
								if (sliderOptions.hasOwnProperty('loop') && sliderOptions['loop']) {
									var slideLength = this.slides.length;
								}
								var length = this.slides.length,
									active = (this.realIndex) + 1,
									next = active + 1,
									prev = active - 1;
								if (active == 1) {
									prev = length;
								}
								if (active == length) {
									next = 1;
								}
								if (isNumberPaginationProgress) {
									_this.parent().find('.number-prev').each(function() {
										$(this).text(active < 10 ? '0' + active : active);
									});
									_this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', ((100 / length) * active).toFixed(2) + '%');
								} else {
									_this.parent().find('.number-next').each(function() {
										$(this).text(next < 10 ? '0' + next : next);
									});
									_this.parent().find('.number-prev').each(function() {
										$(this).text(prev < 10 ? '0' + prev : prev);
									});
									if (showProgress)
										_this.parent().find('.swiper-pagination-progress')[0].style.setProperty('--swiper-progress', ((100 / length) * active).toFixed(2) + '%');
								}
							}
						}
					}
				}
				var thumbClick = _this.attr('data-swiper-thumb-click') || false;
				if (thumbClick && sliderOptions.hasOwnProperty('thumbs')) {
					sliderOptions['thumbs']['swiper']['on'] = {
						click: function(swiper) {
							if (swiper.activeIndex >= swiper.clickedIndex) {
								swiper.slidePrev();
							} else if (swiper.activeIndex < swiper.clickedIndex) {
								swiper.slideNext();
							}
						}
					}
				}
				if (typeof Swiper === 'function') {
					_this.imagesLoaded(function() {
						var swiperObj = new Swiper(swiperItem, sliderOptions);
						swiperObjs.push(swiperObj);
					});
				}
			}
		});
	}
	function setOverLayerPosition() {
		if (($('.overlap-section').length > 0 || $('.overlap-section-one-fourth').length > 0 || $('.overlap-section-three-fourth').length > 0)) {
			$('.overlap-section, .overlap-section-one-fourth, .overlap-section-three-fourth').each(function() {
				let _this = $(this),
					overlayBreakpoint = 767;
				if (_this.hasClass('md-overlap-disable')) {
					overlayBreakpoint = 991;
				} else if (_this.hasClass('sm-overlap-disable')) {
					overlayBreakpoint = 767;
				}
				if (getWindowWidth() > overlayBreakpoint) {
					setTimeout(function() {
						_this.imagesLoaded(function() {
							var closestSectionObj = _this.closest('section');
							if (_this.closest('footer').length) {
								closestSectionObj = _this.closest('footer');
							}
							var sectionPaddingTop = parseInt(closestSectionObj.css('padding-top')),
								areaHeight = _this.find('*').outerHeight(),
								overlayTop = areaHeight + sectionPaddingTop;
							if (_this.hasClass('overlap-section-one-fourth')) {
								overlayTop = (areaHeight / 4) - overlayTop;
							} else if (_this.hasClass('overlap-section-three-fourth')) {
								overlayTop = ((areaHeight * 3) / 4) - overlayTop;
							} else {
								overlayTop = (areaHeight / 2) - overlayTop;
							}
							_this.css('margin-top', overlayTop);
							var parentSectionObj = closestSectionObj.prev('.overlap-height'),
								overlapGap = parentSectionObj.find('.overlap-gap-section');
							parentSectionObj.imagesLoaded(function() {
								if (overlapGap.length > 0) {
									var gapSectionHeight = overlapGap.outerHeight() + (Math.abs(overlayTop) - sectionPaddingTop);
									overlapGap.parents('.overlap-height').height(gapSectionHeight);
								}
							});
						});
					}, 500);
				} else {
					setTimeout(function() {
						$('.overlap-height').height('inherit');
						$('.overlap-section, .overlap-section-one-fourth, .overlap-section-three-fourth').css('margin-top', 'inherit');
					}, 500);
				}
			});
		}
	}
	function setBottomOverLayerPosition(delay) {
		if (($('.overlap-section-bottom').length > 0) && getWindowWidth() >= 768) {
			$('.overlap-section-bottom').each(function() {
				var _this = $(this),
					timeOut = (_this.find('.instafeed-wrapper').length > 0) ? delay : 10;
				setTimeout(function() {
					_this.imagesLoaded(function() {
						var areaHeight = _this.outerHeight(),
							overlayerMargin = ((areaHeight / 2) - areaHeight);
						_this.parents('section').next('.overlap-gap-section-bottom').css('margin-top', overlayerMargin);
						_this.parents('section').next('.overlap-gap-section-bottom').css('padding-top', areaHeight);
					});
				}, timeOut);
			});
		} else {
			$('.overlap-gap-section-bottom').css('margin-top', '');
			$('.overlap-gap-section-bottom').css('padding-top', '');
		}
	}

	stackAnimation();
	var stackLastScroll = 0;
	function stackAnimation() {
		windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
		$('.stack-box').each(function() {
			if ($(window).width() > 1199) {
				var _this = $(this);
				var stackItems = _this.find('.stack-item');
				if (stackItems.length) {
					if (windowScrollTop > stackLastScroll) {
						_this.addClass('forward');
						_this.removeClass('reverse');
					} else {
						_this.removeClass('forward');
						_this.addClass('reverse');
					}
					for (let i = 0; i < stackItems.length - 1; i++) {
						var stackBoxHeight = (_this.height() / (_this.find('.stack-item').length)) * i;
						var stackTopPosition = _this.offset().top;
						if ((windowScrollTop - stackTopPosition) > stackBoxHeight) {
							var yMove = windowScrollTop - stackTopPosition - stackBoxHeight;
							if (yMove > _this.outerHeight()) {
								yMove = _this.outerHeight();
							}
							$(stackItems[i]).css({
								'height': 'calc(100vh - ' + yMove + 'px)'
							});
							$(stackItems[i]).addClass('active');
						} else {
							$(stackItems[i]).css({
								'height': 'calc(100vh - 0px)'
							});
							$(stackItems[i]).removeClass('active');
						}
					}
				}
			} else {
				$('.stack-box .stack-item').css({
					'height': 'inherit'
				});
			}
		});
		stackLastScroll = windowScrollTop;
	}
	$(window).scroll(function() {
		stackAnimation();
	});
})(jQuery);