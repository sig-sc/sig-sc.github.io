#!/usr/bin/perl -w

use strict;
use LWP::Simple;
use HTML::TreeBuilder;
use Encode;
use Data::Dumper;

#my $url = 'http://sig-sc.org/seminar_list.html';
#my $html = get($url);

# コマンドラインで与えられたローカルHTMLファイルを読み込む
my $db = &parse_html_file($ARGV[0]);



for my $date (sort {$b cmp $a} (keys %{$db})) {
	my $s = $db->{$date};
	&generate_post_file($s);
}

# 各回のデータから，Jekyllのpostファイルを生成する
sub generate_post_file {
	my $obj = shift;

	mkdir "_posts", 755;
	my $post_dir = "_posts";
	my $file_name = sprintf "%s-report-of-seminar.md", $obj->{dateStr};
	
	open (my $out, ">$post_dir/$file_name") || die;
	
	#プリアンブル
	print $out "---\n";
	print $out "layout: default\n";
	print $out "title:  \"$obj->{heading} $obj->{date}\"\n";
	print $out "date:   $obj->{dateStr} 21:00:00 +0900\n";
	print $out "categories: seminar report update\n";
	print $out "---\n\n";

	print $out "### $obj->{heading}\n";
	print $out "- __テーマ:__ $obj->{theme}\n";
	print $out "- __日程:__ $obj->{date}\n";
	print $out "- __場所:__ $obj->{location}\n";
	print $out "- __プログラム:__\n";
	print $out "\n\n";
	
	my $content = $obj->{content};
	$content =~ s/file\//\/assets\/file/g;
	print $out "$content\n\n";

	close $out;
}


# 旧SC研のHTMLファイルをパースして，documentを作成
sub parse_html_file {
	my $html = shift;

	#とりあえずファイルを行で保持
	open (my $fh, $html) || die;
	my @lines = <$fh>;
	close $fh;
	#全角：を半角に
	@lines = map { $_ =~ s/：/:/g; $_; } @lines;

	#DOMを生成する
	open($fh, "<:utf8", $html) || die;
	my $dom = HTML::TreeBuilder->new;
	$dom->parse_file($fh);


	## タイトルを取得
	my @headings;
	for my $h2 ($dom->find('h2')) {
		my $str = Encode::encode('utf8', $h2->as_text);
		if ($str !~ /MENU|著作権|過去のイベント/) {
			push @headings, $str;
		}
	}

	## コンテンツ(プログラム)を取得
	my @contents;
	for my $pre ($dom->find('pre')) {
		my $str = Encode::encode('utf8', $pre->as_HTML('&<>'));
		push @contents, $str;
	}

	## 日程，ロケ，テーマを取得
	my @themes = map {$_ =~ s/<.*?>//g; $_ =~ s/：/:/g; $_ =~ s/\s|　//g; $_ =~ /:(.*)/; $1;} 
			grep { /テーマ:/ } @lines;
	my @locations = map {$_ =~ s/<.*?>//g; $_ =~ s/：/:/g; $_ =~ s/\s|　//g; $_ =~ /:(.*)/; $1;} 
					grep { /場所:/} @lines;
	my @dates = map {$_ =~ s/\s|　//g; $_ =~ /(\d\d\d\d年.*)<br/;}
					grep { /\d\d\d\d年/ } @lines;

	## データオブジェクトを作る
	my $db = {};
	for (my $i=0; $i<@headings; $i++) {
		
		my $date = $dates[$i] || "未設定";
		my $dateStr = $date;
		if ($date =~ /(\d+)年(\d+)月(\d+)日/) {
			$dateStr = sprintf "%04d-%02d-%02d", $1, $2, $3;
		} else {
			print STDERR "DATE ERROR: $date\n";
		}
		
		my $location = $locations[$i] || "未設定";
		my $theme = $themes[$i] || "未設定";
		my $heading = $headings[$i];
		my $content = $contents[$i];
		
		my $seminar = {};
		$seminar = {
			date => $date,
			dateStr => $dateStr,
			location => $location,
			theme => $theme,
			heading => $heading,
			content => $content
		};
		$db->{$dateStr} = $seminar;
	}


	return $db;

}


