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

var Header = {
	init : function(){
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
		if ($('.search-wrapper').scrollTop() > 0) {
			$('html').addClass('is-scrolled');
		} else {
			$('html').removeClass('is-scrolled');
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
		$('#header .search a').on('click',function(e){
			e.preventDefault();
			$('html').addClass('open-search');
		});
		$('.search-area .close').on('click',function(e){
			e.preventDefault();
			$('html').removeClass('open-search');
		});
	}
};

var Main = {
	init : function(){
		this.revealed();
	},
	grid : function(){


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
	}
};

//썸네일 채우기
function setDirection(element) {
	if (element.naturalWidth / element.naturalHeight / element.parentNode.offsetWidth * element.parentNode.offsetHeight > 1) {
		element.classList.remove('vertical');
		element.classList.add('horizontal');
	} else {
		element.classList.remove('horizontal');
		element.classList.add('vertical');
	}
}

/* 준비 */
$(function() {


	$('#header-block').load('../_include/header.html');

	Init.defaults();

	setTimeout(function(){
		Header.init();
		common.init();
		Main.init();
	},500);

});