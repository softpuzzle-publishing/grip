var Init = {
	defaults : function(){
		var bodyHeight = 0;
		var bodyWidth = 0;
		var breakpoint;
		this.resize();
		window.addEventListener("resize", this.resize);
	},
	resize : function(){
		Init.getBrowserSize();
		Init.drawBreakPoint();

		Init.breakpoint = window.matchMedia('(min-width:992px)').matches;
		if(!Init.breakpoint){
			$('html').removeClass('is-desktop');
			$('html').addClass('is-mobile');
		}else{
			$('html').removeClass('is-mobile');
			$('html').addClass('is-desktop');
		}
	},
	getBrowserSize : function(){
		this.bodyHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight
		);
		this.bodyWidth = Math.max(
			document.body.scrollWidth,
			document.body.offsetWidth,
			document.documentElement.clientWidth,
			document.documentElement.scrollWidth,
			document.documentElement.offsetWidth
		);
	},
	drawBreakPoint : function(){
		$('html').attr('data-width',this.bodyWidth);
		$('html').attr('data-height',this.bodyHeight);
	},
};

var clubSummaryOffsetTop;
var Header = {
	init : function(){
		if($('.club-summary').length > 0){
			clubSummaryOffsetTop = parseInt($('.club-summary').offset().top);
			console.log(clubSummaryOffsetTop);
		}

		this.menu();
		this.scrolling();
		this.search();
		window.addEventListener('mousewheel', Header.scrolling);
		window.addEventListener('touchmove', Header.scrolling);

		$(window).scroll(function(){
			Header.scrolling();
		});
		$('.search-wrapper').scroll(function(){
			Header.scrolling();
		});
	},
	scrolling : function(e){
		var scrollTop = $(window).scrollTop();
		var gnbTop = $('#header').height();
		gnbTop = Number(gnbTop);

		if(scrollTop > 0){
			$('html').addClass('is-scrolled');
		}else{
			$('html').removeClass('is-scrolled');
		}

		//검색 레이어
		if($('html').hasClass('open-search')){
			if ($('.search-wrapper').scrollTop() > 0) {
				$('html').addClass('is-scrolled');
			} else {
				$('html').removeClass('is-scrolled');
			}
		}

		//클럽상세 - 클럽 summary fixed
		if($('.club-summary').length > 0){
			if(scrollTop > clubSummaryOffsetTop){
				$('html').addClass('summary-fixed');
			}else{
				$('html').removeClass('summary-fixed');
			}
		}
	},
	menu : function(){
		$('.menu-mobile > a').on('click',function(e){
			e.preventDefault();
			$('html').toggleClass('open-mobile-menu');
		});
		$('.dim').on('click', function(e) {
			if($('html').hasClass('open-mobile-menu')){
				$('html').removeClass('open-mobile-menu');
			}
		});
	},
	search : function(){
		$('.search a').on('click',function(e){
			e.preventDefault();
			$('html').addClass('open-search');
			$('#input-search-all').focus();
			if($('body').hasClass('body-main')){
				$.fn.fullpage.setAllowScrolling(false);
			}
		});
		$('.search-area .close').on('click',function(e){
			e.preventDefault();
			$('html').removeClass('open-search');
			if($('body').hasClass('body-main')){
				$.fn.fullpage.setAllowScrolling(true);
			}
		});
		$('.search-area .go-top').on('click',function(e){
			e.preventDefault();
			$('.search-wrapper').stop().animate({
				scrollTop: 0
			}, 250);
		});
	}
};

var Main = {
	init : function(){
		this.revealed();
		this.full();
	},
	full : function(){
		if($('body').hasClass('body-main'))
		var fullpageApi = $('#fullpage').fullpage({
			menu: '#nav',
			anchors: ['main-section1', 'main-section2', 'main-section3', 'main-section4', 'main-section5', 'main-section6', 'main-section7'],
			sectionsColor : ['', '#fbfbfb','', '#fbfbfb','', '#fbfbfb', '#f4f4f4'],
			autoScrolling: true,
			showActiveTooltip: true,
			fitToSection: false,
			slidesNavigation: true,
			navigation: false,
			responsiveWidth: 992,
			/* afterLoad: function(isResponsive){
				$('#main-block').removeAttr('style');
			}, */
			afterResponsive: function(isResponsive){
				//console.log('afterResponsive');
			},
			onLeave: function(origin, destination, direction){
				if(destination > 1){
					$('html').addClass('is-header-hidden');
				}else{
					$('html').removeClass('is-header-hidden');
				}
				var top = $('#nav li').eq(destination-1).position().top;
				$('#nav .bar').css('top',top);

				if(destination == 7){
					$('#nav').addClass('is-last');
				}else{
					$('#nav').removeClass('is-last');
				}
			}
		});
	},
	revealed : function(){
		$('[data-event="revealed"]').each(function (i) {
			if ($(window).scrollTop() + $(window).height() > $(this).offset().top + $(this).outerHeight()) {
				$(this).removeClass('in');
			}
		});
		$(window).scroll(function () {
			$('[data-event="revealed"]').each(function (i) {
				if (($(window).scrollTop() + $(window).height()) - ($(window).height() / 3) > $(this).offset().top) {
					$(this).removeClass('in');
				}
			});
		});
	},
};

var common = {
	init : function(){
		//modal 열릴때 이미지 사이즈 체크
		$('.modal').on('shown.bs.modal', function () {
			setDirection($(this).find('.thumb img')[0]);
		});

		//select
		$('select').selectmenu();
		$(document).on('click','.ui-selectmenu-menu .ui-menu-item-wrapper',function(){
			$('[aria-owns="' + $(this).closest('.ui-menu').attr('id') + '"]').css('color','#252525');
			if($(this).text() == '시/군/구' || $(this).text() == '시/도'){
				$('[aria-owns="' + $(this).closest('.ui-menu').attr('id') + '"]').removeAttr('style');
			}
		});

		//sort
		$(document).on('click','.sort a',function(e){
			e.preventDefault();
			//활성화 되어있는 상태에서 한번더 클릭했을 때
			if($(this).hasClass('active')){
				if($(this).closest('.sort').attr('data-sorting') == 'asc'){
					// 내림차순....
					$(this).closest('.sort').attr('data-sorting','desc');
				}else{
					// 오름차순....
					$(this).closest('.sort').attr('data-sorting','asc');
				}
			}else{
				$(this).closest('.sort').attr('data-sorting','asc');
			}
			$(this).closest('li').siblings().find('a').removeClass('active');
			$(this).addClass('active');
		});

		//가고싶다
		$(document).on('click','.like',function(e){
			var flag = $(this).hasClass('active');
			$('.feedback').attr('data-flag',flag);
			$('.feedback').fadeIn(500);
			setTimeout(function() {
				$('.feedback').fadeOut(800);
			}, 1200);
			$(this).toggleClass('active');
		});

		//좋아요&싫어요
		$(document).on('click','.good ,.bad',function(e){
			if(!$(this).siblings().hasClass('active')){
				$(this).toggleClass('active');
			}else{
				alert('이미 공감한 글입니다');
			}
		});

		//수정&신고&삭제 버튼 토글
		$(document).on('click','.more-toggle > a',function(e){
            e.preventDefault();
            $(this).addClass('active');
        });

		//바깥 클릭시 리뷰 버튼 히든
		$(document).on('mouseup', function(e){
			var layer = $('.more-toggle ul');
			if(layer.is(':visible')){
				if (!layer.is(e.target) && layer.has(e.target).length === 0){
					$('.more-toggle > a').removeClass('active');
				}
			}
		});

		//탭 활성화시 썸네일 이미지 재정렬
        $('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $('.photo > .thumb img').each(function(){
                setDirection($(this)[0]);
            });
        });

		//리뷰 썸네일 확대
        $(document).on('click','.photo > span',function(e){
            if($(this).hasClass("active") === true ){
                $(this).removeClass('active');
            } else{
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                $(this).siblings('.detail').find('img').attr('src',$(this).find('img').attr('src'));
                var t = $('.photo .detail img')[0];
                setTimeout(function(){
                    setDirection(t);
                },10);
            }
        });
        $(document).on('click','.photo .close',function(e){
            $('.photo > span').removeClass('active');
		});

		//아코디언 토글
		$('.accordion-list a').on('click',function(e){
			e.preventDefault();
			$(this).closest('li').toggleClass('active');
		});

		//datepicker
		$('.form-datepicker').datepicker({
			dateFormat: "yy-mm-dd",
			monthNames: [ "01","02","03","04","05","06","07","08","09","10","11","12" ],
			monthNamesShort: [ "1","2","3","4","5","6","7","8","9","10","11","12" ],
			dayNames: [ "(일)","(월)","(화)","(수)","(목)","(금)","(토)" ],
			dayNamesShort: [ "(일)","(월)","(화)","(수)","(목)","(금)","(토)" ],
			yearSuffix: ".",
			showMonthAfterYear: true,
			autoSize: true,
			minDate : '+7',
			maxDate : '+3w',
			beforeShow : function(){ //달력 show
				$(this).addClass('active');
			},
			onClose: function(){ //달력 hide
				$(this).removeClass('active');
			}
		});

		//byte 체크
		$('textarea, input').on("input", function () {
			if($(this).attr('maxlength') !== ""){
				var maxlength = $(this).attr("maxlength");
				var content = $(this).val();

				$($(this).attr('data-byte-target')).html(content.length);

				if (content.length > maxlength) {
					$(this).val(content.substring(0, maxlength));
					$($(this).attr('data-byte-target')).html();
				}
			}
		});

		//공유하기 modal 호출
		$(document).on('click','.share',function(e){
            $('#modal-share').modal('show');
		});
	}
};

//썸네일 채우기
function setDirection(element) {
	if (element.naturalWidth / element.naturalHeight / element.parentNode.offsetWidth * element.parentNode.offsetHeight > 1) {
		element.parentNode.parentNode.classList.remove('vertical');
		element.parentNode.parentNode.classList.add('horizontal');
		element.classList.remove('vertical');
		element.classList.add('horizontal');
	} else {
		element.parentNode.parentNode.classList.remove('horizontal');
		element.parentNode.parentNode.classList.add('vertical');
		element.classList.remove('horizontal');
		element.classList.add('vertical');
	}
}

/* 준비 */
$(function() {

	$('#header-block').load('../_include/header.html');
	$('#footer-block').load('../_include/footer.html');

	Init.defaults();

	setTimeout(function(){
		Header.init();
		common.init();
		Main.init();
	},500);

});